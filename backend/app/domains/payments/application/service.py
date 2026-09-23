"""Payments application service.

The service talks to a gateway *contract* only. It never learns whether the
provider is Paystack, Stripe or the test double: it asks for a payment, records
what came back in its own transaction vocabulary, and hands the caller a
normalised result. That is what makes the provider swappable without touching
this file.

Making confirmation authoritative end-to-end (webhook intake, the order's
transition out of ``PENDING_PAYMENT``, duplicate-event safety) is the next
payment phase; the transaction state machine here is already idempotent so
re-applying a settled outcome is a no-op.
"""

from __future__ import annotations

from decimal import Decimal
from uuid import uuid4

from app.domains.orders.domain.entities import Order
from app.domains.orders.domain.repositories import AbstractOrderRepository
from app.domains.payments.domain.entities import Transaction
from app.domains.payments.domain.enums import PaymentStatus
from app.domains.payments.domain.gateway import (
    AbstractPaymentGateway,
    PaymentInitiation,
    PaymentRequest,
    PaymentVerification,
    RefundRequest,
    RefundResult,
)
from app.domains.payments.domain.repositories import AbstractTransactionRepository
from app.shared.exceptions import ConflictError, NotFoundError

_REFERENCE_PREFIX = "PAY-"


def new_payment_reference() -> str:
    """The internal reference the provider is pointed at."""
    return f"{_REFERENCE_PREFIX}{uuid4().hex[:12].upper()}"


class PaymentService:
    def __init__(
        self,
        *,
        transactions: AbstractTransactionRepository,
        orders: AbstractOrderRepository,
        gateway: AbstractPaymentGateway,
        provider: str | None = None,
    ) -> None:
        self._transactions = transactions
        self._orders = orders
        self._gateway = gateway
        # Configuration names the provider; the gateway contract stays anonymous.
        self._provider = provider or gateway.provider

    async def initiate(
        self, *, user_id: int, order_id: int
    ) -> tuple[Transaction, PaymentInitiation]:
        """Open (or reopen) a payment for one of the caller's unpaid orders."""
        order = await self._own_order(user_id=user_id, order_id=order_id)
        if not order.is_pending_payment:
            raise ConflictError("This order is not awaiting payment")

        transaction = await self._transactions.get_latest_by_order_id(order.id)
        if transaction is not None and transaction.is_paid:
            raise ConflictError("This order has already been paid")
        if transaction is None or transaction.status is PaymentStatus.FAILED:
            transaction = await self._transactions.add(
                self._new_transaction(order)
            )

        result = await self._gateway.create_payment(self._request_for(order, transaction))
        if result.success:
            transaction.attach_initiation(
                provider_reference=result.provider_reference,
                checkout_url=result.checkout_url,
            )
        else:
            transaction.mark_failed(result.message)
        return await self._transactions.save(transaction), result

    async def verify(
        self, *, user_id: int, reference: str
    ) -> tuple[Transaction, PaymentVerification]:
        """Ask the provider whether a payment went through and record the answer.

        An unreachable provider leaves the transaction pending: "unknown" is
        never upgraded into success or failure here.
        """
        transaction = await self._own_transaction(user_id=user_id, reference=reference)

        result = await self._gateway.verify_payment(reference)
        if result.success and result.status is PaymentStatus.PAID:
            transaction.mark_paid(result.provider_reference)
            return await self._transactions.save(transaction), result
        if result.success and result.status is PaymentStatus.FAILED:
            transaction.mark_failed(result.message)
            return await self._transactions.save(transaction), result
        return transaction, result

    async def refund(
        self,
        *,
        reference: str,
        amount: Decimal | None = None,
        reason: str | None = None,
    ) -> tuple[Transaction, RefundResult]:
        """Refund a settled payment (partially or in full)."""
        transaction = await self._transactions.get_by_reference(reference)
        if transaction is None:
            raise NotFoundError("Payment not found")
        if not transaction.is_paid:
            raise ConflictError("Only a paid payment can be refunded")

        result = await self._gateway.refund_payment(
            RefundRequest(transaction_reference=reference, amount=amount, reason=reason)
        )
        if result.success:
            transaction.mark_refunded(result.provider_refund_reference)
            transaction = await self._transactions.save(transaction)
        return transaction, result

    def _new_transaction(self, order: Order) -> Transaction:
        transaction = Transaction(
            id=0,
            reference=new_payment_reference(),
            order_id=order.id,
            amount=order.total,
            currency=order.currency,
            provider=self._provider,
        )
        transaction.validate()
        return transaction

    def _request_for(self, order: Order, transaction: Transaction) -> PaymentRequest:
        return PaymentRequest(
            reference=transaction.reference,
            amount=transaction.amount,
            currency=transaction.currency,
            email=order.contact_email,
            order_reference=order.reference,
        )

    async def _own_order(self, *, user_id: int, order_id: int) -> Order:
        order = await self._orders.get_by_id(order_id)
        if order is None or order.user_id != user_id:
            raise NotFoundError("Order not found")
        return order

    async def _own_transaction(
        self, *, user_id: int, reference: str
    ) -> Transaction:
        transaction = await self._transactions.get_by_reference(reference)
        if transaction is None:
            raise NotFoundError("Payment not found")
        # Ownership is derived from the order the payment belongs to.
        await self._own_order(user_id=user_id, order_id=transaction.order_id)
        return transaction
