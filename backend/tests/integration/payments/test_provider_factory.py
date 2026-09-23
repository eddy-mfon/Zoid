"""Provider selection.

The point of the factory is that configuration -- not code -- decides which
provider is speaking, and that nothing above it can tell. The last test here is
the architecture rule as an executable check.
"""

from __future__ import annotations

import ast
from decimal import Decimal
from pathlib import Path

import pytest

from app import __file__ as app_file
from app.config import Settings, get_settings
from app.domains.orders.domain.entities import Order, OrderItem
from app.domains.payments.application.service import PaymentService
from app.domains.payments.domain.gateway import AbstractPaymentGateway
from app.integrations.payments import (
    PaystackPaymentGateway,
    StripePaymentGateway,
    build_payment_gateway,
    supported_providers,
)
from app.shared.exceptions import ProviderNotConfiguredError
from tests.unit.payments.test_payment_service import (
    InMemoryOrderRepository,
    InMemoryTransactionRepository,
)


def _settings(provider: str) -> Settings:
    """The live configuration with the provider choice changed and keys blanked.

    Secrets are removed on purpose: these tests prove selection and refusal, and
    must never reach a live provider because a developer happens to keep real
    keys in their `.env`.
    """
    return get_settings().model_copy(
        update={
            "payment_provider": provider,
            "paystack_secret_key": "",
            "stripe_secret_key": "",
        }
    )


def _order() -> Order:
    return Order(
        id=10,
        reference="ZD-ABC12345",
        user_id=7,
        currency="NGN",
        contact_name="Ada Zoid",
        contact_email="ada@example.com",
        contact_phone="+234 800 000 0000",
        address_line="12 Concrete Road",
        city_state="Lagos State",
        items=[
            OrderItem(
                id=1,
                variant_id=11,
                product_slug="alpha",
                product_name="Alpha Jersey",
                size="M",
                quantity=2,
                unit_price=Decimal("21000.00"),
            )
        ],
    )


# --- selection ----------------------------------------------------------------


def test_paystack_configuration_selects_the_paystack_adapter() -> None:
    gateway = build_payment_gateway(_settings("paystack"))

    assert isinstance(gateway, PaystackPaymentGateway)
    assert gateway.provider == "paystack"


def test_stripe_configuration_selects_the_stripe_adapter() -> None:
    gateway = build_payment_gateway(_settings("stripe"))

    assert isinstance(gateway, StripePaymentGateway)
    assert gateway.provider == "stripe"


@pytest.mark.parametrize("configured", ["Stripe", "  paystack  ", "PAYSTACK"])
def test_the_provider_name_is_matched_leniently(configured: str) -> None:
    expected = {
        "Stripe": StripePaymentGateway,
        "  paystack  ": PaystackPaymentGateway,
        "PAYSTACK": PaystackPaymentGateway,
    }[configured]

    assert isinstance(build_payment_gateway(_settings(configured)), expected)


def test_an_unsupported_provider_is_refused_by_name() -> None:
    with pytest.raises(ProviderNotConfiguredError) as refused:
        build_payment_gateway(_settings("mercury"))

    message = str(refused.value)
    assert "mercury" in message
    assert "paystack" in message and "stripe" in message


def test_the_supported_names_are_the_adapters_own_labels() -> None:
    """The registry cannot drift away from what the adapters actually claim."""
    assert set(supported_providers()) == {
        PaystackPaymentGateway.provider,
        StripePaymentGateway.provider,
    }


def test_the_factory_offers_only_the_contract() -> None:
    """Callers get `AbstractPaymentGateway`; that is the whole point."""
    for name in supported_providers():
        assert isinstance(build_payment_gateway(_settings(name)), AbstractPaymentGateway)


# --- the PASS condition -------------------------------------------------------


@pytest.mark.parametrize("provider", sorted(supported_providers()))
async def test_the_same_service_drives_whichever_adapter_is_selected(
    provider: str,
) -> None:
    """Changing PAYMENT_PROVIDER changes only the adapter.

    Same ``PaymentService`` class, same constructor call, same code path -- and,
    with no credentials configured, the same loud refusal. No request is ever
    sent to a provider that has not been configured for this deployment.
    """
    service = PaymentService(
        transactions=InMemoryTransactionRepository(),
        orders=InMemoryOrderRepository(_order()),
        gateway=build_payment_gateway(_settings(provider)),
    )

    with pytest.raises(ProviderNotConfiguredError):
        await service.initiate(user_id=7, order_id=10)


def test_no_business_module_names_a_provider_or_reaches_into_integrations() -> None:
    """Domains speak contracts; the wiring lives outside them.

    A Paystack or Stripe import inside ``app/domains`` -- or a direct hop into
    ``app.integrations`` -- would silently re-couple the business to one vendor.
    """
    domains = Path(app_file).parent / "domains"
    assert domains.is_dir()

    offenders: list[str] = []
    for module in sorted(domains.rglob("*.py")):
        imported = _imported_modules(module)
        for name in imported:
            lowered = name.lower()
            if "paystack" in lowered or "stripe" in lowered:
                offenders.append(f"{module}: imports {name}")
            if name.startswith("app.integrations"):
                offenders.append(f"{module}: reaches into integrations")

    assert offenders == []


def _imported_modules(module: Path) -> list[str]:
    tree = ast.parse(module.read_text(encoding="utf-8"))
    names: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names.extend(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            names.append(node.module)
    return names
