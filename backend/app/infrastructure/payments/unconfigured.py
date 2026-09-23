"""The gateway used until a provider adapter exists.

Provider selection is configuration-driven, and the adapter for the configured
name is landed separately. Until then the application stays importable and every
payment attempt fails with a clear 501 naming the provider, rather than
pretending to charge a customer or silently falling back to a different one.
"""

from __future__ import annotations

from app.domains.payments.domain.gateway import (
    AbstractPaymentGateway,
    PaymentInitiation,
    PaymentRequest,
    PaymentVerification,
    RefundRequest,
    RefundResult,
)
from app.shared.exceptions import ProviderNotConfiguredError


class UnconfiguredPaymentGateway(AbstractPaymentGateway):
    """A gateway that answers every request with 'no adapter for this provider'."""

    def __init__(self, provider: str = "") -> None:
        self.provider = provider or "unconfigured"

    def _unavailable(self) -> ProviderNotConfiguredError:
        return ProviderNotConfiguredError(
            f"Payment provider '{self.provider}' has no adapter configured yet."
        )

    async def create_payment(self, request: PaymentRequest) -> PaymentInitiation:
        raise self._unavailable()

    async def verify_payment(self, reference: str) -> PaymentVerification:
        raise self._unavailable()

    async def refund_payment(self, request: RefundRequest) -> RefundResult:
        raise self._unavailable()
