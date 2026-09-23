"""The Paystack adapter, against a scripted Paystack.

No network, no real keys: the adapter's transport is a replay of recorded
provider answers. What is being proved is the translation in both directions --
our contract in, Paystack's wire format out, and Paystack's envelope back into
normalised results.
"""

from __future__ import annotations

import json
from collections.abc import Iterator
from decimal import Decimal
from typing import Any

import httpx
import pytest

from app.domains.payments.domain.enums import PaymentAction, PaymentStatus
from app.domains.payments.domain.gateway import (
    AbstractPaymentGateway,
    PaymentRequest,
    RefundRequest,
)
from app.integrations.payments.paystack import PaystackPaymentGateway
from app.shared.exceptions import ProviderNotConfiguredError

SECRET = "sk_test_paystack"
CALLBACK = "http://localhost:5173/checkout"
INTERNAL_REFERENCE = "PAY-INTERNAL1"


def _request(amount: Decimal = Decimal("42000.00")) -> PaymentRequest:
    return PaymentRequest(
        reference=INTERNAL_REFERENCE,
        amount=amount,
        currency="NGN",
        email="ada@example.com",
        order_reference="ZD-ORDER1",
    )


def _initialized(**overrides: Any) -> dict[str, Any]:
    data: dict[str, Any] = {
        "authorization_url": "https://checkout.paystack.com/0123456789abcdef",
        "access_code": "0123456789abcdef",
        "reference": INTERNAL_REFERENCE,
    }
    data.update(overrides)
    return {"status": True, "message": "Authorization URL created", "data": data}


def _verified(status: str, **overrides: Any) -> dict[str, Any]:
    data: dict[str, Any] = {
        "status": status,
        "reference": INTERNAL_REFERENCE,
        "gateway_reference": "PS-GW-999",
        "amount": 4200000,
        "currency": "NGN",
    }
    data.update(overrides)
    return {"status": True, "message": "Transaction verified successfully", "data": data}


class PaystackRecorder:
    """A fake Paystack: replies in order, and remembers what it was asked."""

    def __init__(
        self,
        *replies: tuple[int, dict[str, Any]],
        error: Exception | None = None,
    ) -> None:
        self.error = error
        self.requests: list[httpx.Request] = []
        self._replies: Iterator[tuple[int, dict[str, Any]]] = iter(replies)
        self._last: tuple[int, dict[str, Any]] = (200, _initialized())

    @property
    def transport(self) -> httpx.MockTransport:
        return httpx.MockTransport(self._handle)

    def _handle(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        if self.error is not None:
            raise self.error
        try:
            self._last = next(self._replies)
        except StopIteration:
            pass
        status_code, body = self._last
        return httpx.Response(status_code, json=body)

    def body(self, index: int = 0) -> dict[str, Any]:
        raw = self.requests[index].content
        return json.loads(raw.decode()) if raw else {}


def _gateway(recorder: PaystackRecorder, *, secret_key: str = SECRET) -> PaystackPaymentGateway:
    return PaystackPaymentGateway(
        secret_key=secret_key,
        callback_url=CALLBACK,
        transport=recorder.transport,
    )


# --- the contract -------------------------------------------------------------


def test_the_adapter_is_a_payment_gateway() -> None:
    gateway = _gateway(PaystackRecorder())

    assert isinstance(gateway, AbstractPaymentGateway)
    assert gateway.provider == "paystack"


# --- initiation ---------------------------------------------------------------


async def test_initiation_asks_paystack_in_paystacks_shape() -> None:
    recorder = PaystackRecorder((200, _initialized()))

    await _gateway(recorder).create_payment(_request())

    request = recorder.requests[0]
    assert request.method == "POST"
    assert request.url.path == "/transaction/initialize"
    assert request.headers["Authorization"] == f"Bearer {SECRET}"
    body = recorder.body()
    assert body["email"] == "ada@example.com"
    assert body["currency"] == "NGN"
    assert body["reference"] == INTERNAL_REFERENCE  # our reference, not theirs
    assert body["amount"] == 4200000  # kobo, because Paystack only speaks kobo
    assert body["callback_url"] == CALLBACK
    custom = body["metadata"]["custom_fields"][0]
    assert custom["value"] == "ZD-ORDER1"


async def test_a_paystack_authorization_url_becomes_a_generic_redirect() -> None:
    recorder = PaystackRecorder((200, _initialized()))

    initiation = await _gateway(recorder).create_payment(_request())

    assert initiation.success is True
    assert initiation.status is PaymentStatus.PENDING
    assert initiation.transaction_reference == INTERNAL_REFERENCE
    assert initiation.provider_reference == "0123456789abcdef"
    assert initiation.checkout_url == "https://checkout.paystack.com/0123456789abcdef"
    assert initiation.action is PaymentAction.REDIRECT
    assert initiation.next_action == (
        PaymentAction.REDIRECT,
        "https://checkout.paystack.com/0123456789abcdef",
    )


@pytest.mark.parametrize(
    ("status_code", "message"),
    [(200, "Invalid API Key"), (400, "Amount must be given in kobo")],
)
async def test_paystack_saying_no_is_a_decline_not_an_exception(
    status_code: int, message: str
) -> None:
    recorder = PaystackRecorder(
        (status_code, {"status": False, "message": message, "data": None})
    )

    initiation = await _gateway(recorder).create_payment(_request())

    assert initiation.success is False
    assert initiation.status is PaymentStatus.FAILED
    assert initiation.message == message


async def test_a_redirect_without_a_page_is_not_reported_as_payable() -> None:
    recorder = PaystackRecorder((200, _initialized(authorization_url="")))

    initiation = await _gateway(recorder).create_payment(_request())

    assert initiation.success is False
    assert initiation.status is PaymentStatus.FAILED


@pytest.mark.parametrize(
    "error",
    [httpx.ConnectError("connection refused"), httpx.ReadTimeout("read timed out")],
)
async def test_paystack_being_unreachable_is_not_a_decline(error: Exception) -> None:
    recorder = PaystackRecorder(error=error)

    initiation = await _gateway(recorder).create_payment(_request())

    # Unsettled, so the next attempt reopens the conversation.
    assert initiation.success is False
    assert initiation.status is PaymentStatus.PENDING
    assert "reach" in (initiation.message or "").lower()


# --- verification -------------------------------------------------------------


async def test_verification_asks_paystack_about_our_reference() -> None:
    recorder = PaystackRecorder((200, _verified("success")))

    await _gateway(recorder).verify_payment(INTERNAL_REFERENCE)

    assert recorder.requests[0].method == "GET"
    assert recorder.requests[0].url.path == f"/transaction/verify/{INTERNAL_REFERENCE}"


@pytest.mark.parametrize(
    ("answer", "expected"),
    [
        ("success", PaymentStatus.PAID),
        ("failed", PaymentStatus.FAILED),
        ("pending", PaymentStatus.PENDING),
        ("abandoned", PaymentStatus.PENDING),  # unknown is never a verdict
    ],
)
async def test_paystacks_transaction_status_is_normalised(
    answer: str, expected: PaymentStatus
) -> None:
    recorder = PaystackRecorder((200, _verified(answer)))

    verification = await _gateway(recorder).verify_payment(INTERNAL_REFERENCE)

    assert verification.success is True  # Paystack answered
    assert verification.status is expected  # ...and this is where the money is


async def test_verification_reports_the_money_that_actually_arrived() -> None:
    recorder = PaystackRecorder((200, _verified("success")))

    verification = await _gateway(recorder).verify_payment(INTERNAL_REFERENCE)

    assert verification.amount == Decimal("42000.00")  # back from kobo
    assert verification.provider_reference == "PS-GW-999"
    assert verification.transaction_reference == INTERNAL_REFERENCE


async def test_verification_cannot_invent_a_settled_payment() -> None:
    """A 404 from Paystack is 'no answer', never a paid status."""
    recorder = PaystackRecorder(
        (404, {"status": False, "message": "No such transaction", "data": None})
    )

    verification = await _gateway(recorder).verify_payment(INTERNAL_REFERENCE)

    assert verification.success is False
    assert verification.status is PaymentStatus.PENDING


async def test_verification_when_paystack_cannot_be_reached() -> None:
    recorder = PaystackRecorder(error=httpx.ConnectError("connection refused"))

    verification = await _gateway(recorder).verify_payment(INTERNAL_REFERENCE)

    assert verification.success is False
    assert verification.status is PaymentStatus.PENDING


# --- refunds ------------------------------------------------------------------


async def test_a_full_refund_is_requested_without_an_amount() -> None:
    recorder = PaystackRecorder(
        (200, {"status": True, "message": "Refund has been queued", "data": {"id": 91}})
    )

    result = await _gateway(recorder).refund_payment(
        RefundRequest(transaction_reference=INTERNAL_REFERENCE)
    )

    assert recorder.requests[0].url.path == f"/transaction/{INTERNAL_REFERENCE}/refund"
    assert "amount" not in recorder.body()
    assert result.success is True
    assert result.status is PaymentStatus.REFUNDED
    assert result.provider_refund_reference == "91"


async def test_a_partial_refund_carries_kobo_and_the_merchants_note() -> None:
    recorder = PaystackRecorder(
        (200, {"status": True, "message": "Refund has been queued", "data": {"id": 92}})
    )

    await _gateway(recorder).refund_payment(
        RefundRequest(
            transaction_reference=INTERNAL_REFERENCE,
            amount=Decimal("1000.00"),
            reason="One jersey returned",
        )
    )

    body = recorder.body()
    assert body["amount"] == 100000
    assert body["merchant_note"] == "One jersey returned"


@pytest.mark.parametrize(
    "reply",
    [
        (400, {"status": False, "message": "Refund amount exceeds available balance"}),
        (
            200,
            {
                "status": True,
                "message": "Refund failed",
                "data": {"id": 93, "status": "failed"},
            },
        ),
    ],
)
async def test_a_refused_refund_leaves_the_payment_paid(reply: tuple[int, Any]) -> None:
    recorder = PaystackRecorder(reply)

    result = await _gateway(recorder).refund_payment(
        RefundRequest(transaction_reference=INTERNAL_REFERENCE)
    )

    assert result.success is False
    assert result.status is PaymentStatus.PAID
    assert result.message


# --- configuration -----------------------------------------------------------


@pytest.mark.parametrize("capability", ["create", "verify", "refund"])
async def test_missing_credentials_refuse_to_charge_anything(capability: str) -> None:
    recorder = PaystackRecorder((200, _initialized()))
    gateway = _gateway(recorder, secret_key="")
    call = {
        "create": lambda: gateway.create_payment(_request()),
        "verify": lambda: gateway.verify_payment(INTERNAL_REFERENCE),
        "refund": lambda: gateway.refund_payment(
            RefundRequest(transaction_reference=INTERNAL_REFERENCE)
        ),
    }[capability]

    with pytest.raises(ProviderNotConfiguredError):
        await call()

    assert recorder.requests == []
