"""Provider selection.

Configuration names the provider; this module is the only place that maps that
name to a concrete adapter. Everything above it receives the
``AbstractPaymentGateway`` contract, which is what lets ``PAYMENT_PROVIDER`` be
changed without touching a line of business logic.

The table is the whole policy: add an adapter, list it here, configure it.
"""

from __future__ import annotations

from collections.abc import Callable

from app.config import Settings, get_settings
from app.domains.payments.domain.gateway import AbstractPaymentGateway
from app.integrations.payments.paystack import PaystackPaymentGateway
from app.integrations.payments.stripe import StripePaymentGateway
from app.shared.exceptions import ProviderNotConfiguredError


def _paystack(settings: Settings) -> AbstractPaymentGateway:
    return PaystackPaymentGateway(
        secret_key=settings.paystack_secret_key,
        callback_url=settings.payment_return_url,
    )


def _stripe(settings: Settings) -> AbstractPaymentGateway:
    return StripePaymentGateway(
        secret_key=settings.stripe_secret_key,
        return_url=settings.payment_return_url,
    )


#: provider name (as configured) -> adapter builder
_BUILDERS: dict[str, Callable[[Settings], AbstractPaymentGateway]] = {
    PaystackPaymentGateway.provider: _paystack,
    StripePaymentGateway.provider: _stripe,
}


def supported_providers() -> tuple[str, ...]:
    """The provider names this deployment can be configured with."""
    return tuple(_BUILDERS)


def build_payment_gateway(settings: Settings | None = None) -> AbstractPaymentGateway:
    """The gateway for the configured provider, as the contract.

    Credentials are *not* checked here: an adapter with a missing secret key
    fails loudly when a payment is actually attempted (501), which keeps an
    unconfigured deployment importable and its failure obvious.
    """
    config = settings if settings is not None else get_settings()
    provider = config.payment_provider.strip().lower()
    builder: Callable[[Settings], AbstractPaymentGateway] | None = _BUILDERS.get(provider)
    if builder is None:
        raise ProviderNotConfiguredError(
            f"Unsupported payment provider '{config.payment_provider}'. "
            f"Configure one of: {', '.join(supported_providers())}."
        )
    return builder(config)
