"""The transaction aggregate: our record of one attempt to be paid.

A transaction is the internal, provider-independent ledger entry for an order's
payment. It owns its own state machine (pending -> paid -> refunded, or failed)
so that "did the money arrive" is a decision with one home, regardless of which
provider reported it.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal

from app.domains.payments.domain.enums import PaymentStatus
from app.shared.exceptions import ConflictError, ValidationError


@dataclass
class Transaction:
    """A payment attempt against a single order."""

    id: int
    reference: str
    order_id: int
    amount: Decimal
    currency: str
    provider: str
    status: PaymentStatus = PaymentStatus.PENDING
    provider_reference: str | None = None
    checkout_url: str | None = None
    failure_reason: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @property
    def is_pending(self) -> bool:
        return self.status is PaymentStatus.PENDING

    @property
    def is_paid(self) -> bool:
        return self.status is PaymentStatus.PAID

    def attach_initiation(
        self, *, provider_reference: str | None, checkout_url: str | None
    ) -> None:
        """Record what the provider handed back to continue the payment."""
        if not self.is_pending:
            raise ConflictError("Only a pending transaction can be (re-)initiated")
        self.provider_reference = provider_reference or self.provider_reference
        self.checkout_url = checkout_url or self.checkout_url

    def mark_paid(self, provider_reference: str | None = None) -> None:
        """Settle the transaction. Repeating it is harmless (idempotent)."""
        if self.is_paid:
            return
        if not self.is_pending:
            raise ConflictError(
                f"A {self.status.value} transaction cannot become paid"
            )
        self.status = PaymentStatus.PAID
        if provider_reference:
            self.provider_reference = provider_reference
        self.failure_reason = None
        self.checkout_url = None

    def mark_failed(self, reason: str | None = None) -> None:
        """Abandon this attempt; a fresh transaction is needed to retry."""
        if self.is_paid:
            raise ConflictError("A paid transaction cannot be marked failed")
        self.status = PaymentStatus.FAILED
        self.failure_reason = reason or self.failure_reason or "Payment failed."

    def mark_refunded(self, provider_refund_reference: str | None = None) -> None:
        if self.status is PaymentStatus.REFUNDED:
            return
        if not self.is_paid:
            raise ConflictError("Only a paid transaction can be refunded")
        self.status = PaymentStatus.REFUNDED
        self.provider_reference = provider_refund_reference or self.provider_reference

    def validate(self) -> None:
        if not self.reference:
            raise ValidationError("Transaction requires a reference")
        if self.order_id is None:
            raise ValidationError("Transaction requires an order")
        if self.amount is None or self.amount <= Decimal("0"):
            raise ValidationError("Transaction amount must be positive")
        if not self.currency or len(self.currency) != 3:
            raise ValidationError("Transaction requires a 3-letter currency code")
