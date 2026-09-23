"""Paystack adapter.

Everything that is Paystack-specific lives here and nowhere else: the REST
endpoints, the kobo-denominated amounts, the ``{"status", "message", "data"}``
envelope, and Paystack's own error text. The application sees only the payment
contract, so a Paystack redirect is indistinguishable from any other.

Two choices worth stating:

* One short-lived ``httpx.AsyncClient`` per call. Payment traffic is sparse, the
  overhead is negligible, and no connection state outlives the request.
* Unreachable is not the same as declined. A transport problem is reported as
  ``success=False`` with a ``PENDING`` status so the attempt stays open, while an
  explicit "no" from Paystack is reported as ``FAILED``.

Webhook signature verification arrives with the confirmation workflow -- in this
same file, because a Paystack signature is a Paystack detail.
"""

from __future__ import annotations

from collections.abc import Mapping
from decimal import ROUND_HALF_UP, Decimal
from typing import Any

import httpx

from app.domains.payments.domain.enums import PaymentAction, PaymentStatus
from app.domains.payments.domain.gateway import (
    AbstractPaymentGateway,
    PaymentInitiation,
    PaymentRequest,
    PaymentVerification,
    RefundRequest,
    RefundResult,
)
from app.shared.exceptions import ProviderNotConfiguredError

DEFAULT_BASE_URL = "https://api.paystack.co"
#: Paystack answers "success" for a settled transaction.
_VERIFICATION_STATUSES = {
    "success": PaymentStatus.PAID,
    "failed": PaymentStatus.FAILED,
    "pending": PaymentStatus.PENDING,
}
_TIMEOUT_SECONDS = 15.0


def _to_smallest_unit(amount: Decimal) -> int:
    """Naira to kobo, which is the only unit Paystack accepts."""
    return int((amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _from_smallest_unit(value: Any) -> Decimal | None:
    if not isinstance(value, int):
        return None
    return (Decimal(value) / 100).quantize(Decimal("0.01"))


class PaystackPaymentGateway(AbstractPaymentGateway):
    """The payment contract, spoken to Paystack."""

    provider = "paystack"

    def __init__(
        self,
        *,
        secret_key: str,
        callback_url: str = "",
        base_url: str = DEFAULT_BASE_URL,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self._secret_key = secret_key
        self._callback_url = callback_url
        self._base_url = base_url
        self._transport = transport

    async def create_payment(self, request: PaymentRequest) -> PaymentInitiation:
        payload: dict[str, Any] = {
            "email": request.email,
            "amount": _to_smallest_unit(request.amount),
            "currency": request.currency,
            "reference": request.reference,
            "callback_url": self._callback_url,
            "metadata": {
                "custom_fields": [
                    {
                        "display_name": "Order",
                        "variable": "order_reference",
                        "value": request.order_reference,
                    }
                ]
            },
        }
        try:
            status_code, body = await self._call("POST", "/transaction/initialize", payload)
        except httpx.HTTPError as exc:
            return PaymentInitiation(
                success=False,
                status=PaymentStatus.PENDING,
                transaction_reference=request.reference,
                message=f"Could not reach Paystack: {exc}",
            )

        if not _accepted(status_code, body):
            return PaymentInitiation(
                success=False,
                status=PaymentStatus.FAILED,
                transaction_reference=request.reference,
                message=_message(body) or "Paystack declined to start the payment.",
            )

        data = _data(body)
        authorization_url = data.get("authorization_url")
        if not isinstance(authorization_url, str) or not authorization_url:
            return PaymentInitiation(
                success=False,
                status=PaymentStatus.FAILED,
                transaction_reference=request.reference,
                message="Paystack returned no payment page.",
            )

        return PaymentInitiation(
            success=True,
            status=PaymentStatus.PENDING,
            # Paystack echoes our reference back; the access code is the handle
            # on the attempt until a gateway reference exists.
            transaction_reference=str(data.get("reference") or request.reference),
            provider_reference=_as_text(data.get("access_code")),
            checkout_url=authorization_url,
            action=PaymentAction.REDIRECT,
            message=_message(body),
        )

    async def verify_payment(self, reference: str) -> PaymentVerification:
        try:
            status_code, body = await self._call("GET", f"/transaction/verify/{reference}")
        except httpx.HTTPError as exc:
            return PaymentVerification(
                success=False,
                status=PaymentStatus.PENDING,
                transaction_reference=reference,
                message=f"Could not reach Paystack: {exc}",
            )

        if not _accepted(status_code, body):
            return PaymentVerification(
                success=False,
                status=PaymentStatus.PENDING,
                transaction_reference=reference,
                message=_message(body) or "Paystack did not answer the verification.",
            )

        data = _data(body)
        answer = str(data.get("status") or "").lower()
        return PaymentVerification(
            success=True,
            status=_VERIFICATION_STATUSES.get(answer, PaymentStatus.PENDING),
            transaction_reference=str(data.get("reference") or reference),
            provider_reference=_as_text(data.get("gateway_reference")),
            amount=_from_smallest_unit(data.get("amount")),
            message=_message(body),
        )

    async def refund_payment(self, request: RefundRequest) -> RefundResult:
        payload: dict[str, Any] = {}
        if request.amount is not None:
            payload["amount"] = _to_smallest_unit(request.amount)
        if request.reason:
            payload["merchant_note"] = request.reason

        try:
            status_code, body = await self._call(
                "POST", f"/transaction/{request.transaction_reference}/refund", payload
            )
        except httpx.HTTPError as exc:
            return RefundResult(
                success=False,
                status=PaymentStatus.PAID,
                transaction_reference=request.transaction_reference,
                message=f"Could not reach Paystack: {exc}",
            )

        data = _data(body)
        refused = str(data.get("status") or "").lower() == "failed"
        if refused or not _accepted(status_code, body):
            return RefundResult(
                success=False,
                status=PaymentStatus.PAID,
                transaction_reference=request.transaction_reference,
                message=_message(body) or "Paystack declined the refund.",
            )

        amount = _from_smallest_unit(data.get("amount"))
        return RefundResult(
            success=True,
            status=PaymentStatus.REFUNDED,
            transaction_reference=request.transaction_reference,
            provider_refund_reference=_as_text(data.get("id")),
            amount=amount if amount is not None else request.amount,
            message=_message(body),
        )

    async def _call(
        self, method: str, path: str, payload: Mapping[str, Any] | None = None
    ) -> tuple[int, dict[str, Any]]:
        self._require_credentials()
        headers = {"Authorization": f"Bearer {self._secret_key}"}
        async with httpx.AsyncClient(
            base_url=self._base_url,
            headers=headers,
            transport=self._transport,
            timeout=_TIMEOUT_SECONDS,
        ) as client:
            response = await client.request(method, path, json=payload)

        body = response.json()
        if not isinstance(body, dict):
            body = {"message": str(body)}
        return response.status_code, body

    def _require_credentials(self) -> None:
        if not self._secret_key:
            raise ProviderNotConfiguredError(
                "Payment provider 'paystack' is selected but PAYSTACK_SECRET_KEY "
                "is not configured."
            )


def _accepted(status_code: int, body: Mapping[str, Any]) -> bool:
    """Paystack says ``status: true`` when it is happy, alongside a 2xx."""
    return 200 <= status_code < 300 and body.get("status") is True


def _data(body: Mapping[str, Any]) -> dict[str, Any]:
    data = body.get("data")
    return dict(data) if isinstance(data, Mapping) else {}


def _message(body: Mapping[str, Any]) -> str | None:
    message = body.get("message")
    return str(message) if isinstance(message, str) and message else None


def _as_text(value: Any) -> str | None:
    return str(value) if value is not None else None
