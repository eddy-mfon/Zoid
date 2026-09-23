"""Payment statuses and next-action vocabulary.

These are *payment* concerns and deliberately separate from order status: an
order can stay ``PENDING_PAYMENT`` while a transaction is ``pending``, and a
verified transaction becomes ``paid`` regardless of which provider produced the
answer.
"""

from __future__ import annotations

from enum import StrEnum


class PaymentStatus(StrEnum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentAction(StrEnum):
    """What the client must do next to complete a payment."""

    REDIRECT = "redirect"
