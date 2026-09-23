"""Payments endpoints against the configured database, with a fake provider.

Persistence, ownership and permission are exercised for real; the provider is a
scripted double injected through the dependency container -- the same seam a
Paystack or Stripe adapter will slot into, which is the point of the contract.
"""

from __future__ import annotations

from collections.abc import Iterator
from decimal import Decimal
from uuid import uuid4

import pytest
from fastapi import Depends
from fastapi.testclient import TestClient

from app.config import get_settings
from app.domains.payments.application.service import PaymentService
from app.domains.payments.domain.enums import PaymentAction, PaymentStatus
from app.domains.payments.domain.gateway import (
    AbstractPaymentGateway,
    PaymentInitiation,
    PaymentRequest,
    PaymentVerification,
    RefundRequest,
    RefundResult,
)
from app.domains.products.domain.entities import (
    Category,
    Inventory,
    Product,
    ProductImage,
    ProductVariant,
)
from app.infrastructure.container import get_payment_service, get_unit_of_work
from app.infrastructure.persistence.sqlalchemy.session import (
    build_sessionmaker,
    create_engine_from_url,
)
from app.infrastructure.persistence.sqlalchemy.unit_of_work import (
    AbstractUnitOfWork,
    SqlAlchemyUnitOfWork,
)
from app.integrations.payments import build_payment_gateway
from app.security.authentication.session import session_strategy_from_settings

_settings = get_settings()
API = _settings.api_v1_prefix
COOKIE = _settings.cookie_name
PASSWORD = "Sup3rSecret!"
PRICE = Decimal("42000.00")

CHECKOUT = {
    "contact_name": "Ada Zoid",
    "contact_email": "ada@example.com",
    "contact_phone": "+234 800 000 0000",
    "address_line": "12 Concrete Road",
    "city_state": "Lagos State",
}


class ScriptedGateway(AbstractPaymentGateway):
    """A provider double: it accepts anything and reports it as paid."""

    provider = "scripted"

    def __init__(self) -> None:
        self.requests: list[PaymentRequest] = []
        self.verified: list[str] = []
        self.refunds: list[RefundRequest] = []

    async def create_payment(self, request: PaymentRequest) -> PaymentInitiation:
        self.requests.append(request)
        return PaymentInitiation(
            success=True,
            status=PaymentStatus.PENDING,
            transaction_reference=request.reference,
            provider_reference=f"prov-{request.reference}",
            checkout_url=f"https://provider.example/checkout/{request.reference}",
            action=PaymentAction.REDIRECT,
        )

    async def verify_payment(self, reference: str) -> PaymentVerification:
        self.verified.append(reference)
        return PaymentVerification(
            success=True,
            status=PaymentStatus.PAID,
            transaction_reference=reference,
            provider_reference=f"prov-{reference}",
            amount=PRICE,
        )

    async def refund_payment(self, request: RefundRequest) -> RefundResult:
        self.refunds.append(request)
        return RefundResult(
            success=True,
            status=PaymentStatus.REFUNDED,
            transaction_reference=request.transaction_reference,
            provider_refund_reference=f"rf-{request.transaction_reference}",
            amount=request.amount,
        )


@pytest.fixture
def gateway(client: TestClient) -> Iterator[ScriptedGateway]:
    """Swap the wired gateway for the scripted double, for one test only."""
    scripted = ScriptedGateway()

    async def overridden(
        uow: AbstractUnitOfWork = Depends(get_unit_of_work),
    ) -> PaymentService:
        return PaymentService(
            transactions=uow.transactions,
            orders=uow.orders,
            gateway=scripted,
            provider=scripted.provider,
        )

    client.app.dependency_overrides[get_payment_service] = overridden
    yield scripted
    client.app.dependency_overrides.pop(get_payment_service, None)


def _make_product() -> Product:
    tag = uuid4().hex[:8]
    return Product(
        id=0,
        slug=f"pay-jersey-{tag}",
        name=f"Pay Jersey {tag}",
        category=Category(id=0, name="Pay Curated", slug="pay-curated"),
        price=PRICE,
        images=[ProductImage(url="/front.jpg", view="front")],
        variants=[
            ProductVariant(
                id=0, sku=f"pay-{tag}-M", size="M", inventory=Inventory(quantity=10)
            )
        ],
    )


async def _seed_product() -> str:
    engine = create_engine_from_url()
    try:
        async with SqlAlchemyUnitOfWork(build_sessionmaker(engine)) as uow:
            created = await uow.products.add(_make_product())
            await uow.commit()
            return created.slug
    finally:
        await engine.dispose()


def _register_and_login(client: TestClient) -> tuple[str, int]:
    email = f"zoid-pay-{uuid4()}@example.com"
    signup = client.post(
        f"{API}/auth/signup",
        json={"name": "Payer", "email": email, "password": PASSWORD},
    )
    assert signup.status_code == 201, signup.text
    login = client.post(f"{API}/auth/login", json={"email": email, "password": PASSWORD})
    assert login.status_code == 200, login.text
    session = login.cookies.get(COOKIE)
    me = client.get(f"{API}/auth/me", cookies={COOKIE: session})
    assert me.status_code == 200, me.text
    return session, me.json()["id"]


async def _placed_order(client: TestClient, session: str) -> int:
    """Cart -> order over HTTP, the way a customer reaches the pay step."""
    slug = await _seed_product()
    added = client.post(
        f"{API}/cart/items",
        cookies={COOKIE: session},
        json={"product_slug": slug, "size": "M", "quantity": 1},
    )
    assert added.status_code == 200, added.text
    order = client.post(f"{API}/orders", cookies={COOKIE: session}, json=CHECKOUT)
    assert order.status_code == 201, order.text
    return order.json()["id"]


def _initiate(client: TestClient, session: str, order_id: int):
    return client.post(
        f"{API}/payments/initiate", cookies={COOKIE: session}, json={"order_id": order_id}
    )


def _admin_token(user_id: int) -> str:
    """A session token carrying the admin role, minted with the real strategy."""
    return session_strategy_from_settings().issue(str(user_id), role="admin")[0]


async def test_payment_endpoints_reject_anonymous_callers(client: TestClient) -> None:
    assert client.post(f"{API}/payments/initiate", json={"order_id": 1}).status_code == 401
    assert (
        client.post(f"{API}/payments/verify", json={"reference": "PAY-x"})
    ).status_code == 401
    assert client.post(f"{API}/payments/refunds", json={"reference": "PAY-x"}).status_code == 401


async def test_customers_cannot_refund(
    client: TestClient, gateway: ScriptedGateway
) -> None:
    session, _ = _register_and_login(client)

    response = client.post(
        f"{API}/payments/refunds",
        cookies={COOKIE: session},
        json={"reference": "PAY-whatever"},
    )

    assert response.status_code == 403, response.text


async def test_a_provider_without_credentials_refuses_to_charge_anything(
    client: TestClient,
) -> None:
    """Selection is the factory's, persistence is the database's.

    Only the secret key is pinned -- so the endpoint proves that an
    under-configured provider fails loudly (501) instead of quietly doing
    something else, and that no payment attempt can leave the process.
    """
    session, _ = _register_and_login(client)
    order_id = await _placed_order(client, session)
    keyless = get_settings().model_copy(
        update={"payment_provider": "paystack", "paystack_secret_key": ""}
    )

    async def overridden(
        uow: AbstractUnitOfWork = Depends(get_unit_of_work),
    ) -> PaymentService:
        return PaymentService(
            transactions=uow.transactions,
            orders=uow.orders,
            gateway=build_payment_gateway(keyless),
        )

    client.app.dependency_overrides[get_payment_service] = overridden
    try:
        response = _initiate(client, session, order_id)
    finally:
        client.app.dependency_overrides.pop(get_payment_service, None)

    assert response.status_code == 501, response.text
    assert "not configured" in response.json()["detail"]


async def test_initiate_verify_and_refund_flow(
    client: TestClient, gateway: ScriptedGateway
) -> None:
    session, user_id = _register_and_login(client)
    order_id = await _placed_order(client, session)

    initiated = _initiate(client, session, order_id)

    assert initiated.status_code == 200, initiated.text
    body = initiated.json()
    # The standardized response: the client is told to redirect, never which
    # provider it is redirecting to.
    assert body["success"] is True
    assert body["status"] == "pending"
    assert body["payment_id"].startswith("PAY-")
    assert body["amount"] == float(PRICE)
    assert body["provider"] == "scripted"
    assert body["next_action"]["type"] == "redirect"
    assert body["next_action"]["url"].startswith("https://provider.example/checkout/")
    assert gateway.requests[0].order_reference.startswith("ZD-")

    verified = client.post(
        f"{API}/payments/verify",
        cookies={COOKIE: session},
        json={"reference": body["payment_id"]},
    )
    assert verified.status_code == 200, verified.text
    assert verified.json()["status"] == "paid"
    assert verified.json()["next_action"] is None

    refunded = client.post(
        f"{API}/payments/refunds",
        cookies={COOKIE: _admin_token(user_id)},
        json={"reference": body["payment_id"], "reason": "Returned jersey"},
    )
    assert refunded.status_code == 200, refunded.text
    assert refunded.json()["status"] == "refunded"
    assert gateway.refunds[0].reason == "Returned jersey"

    # A settled payment cannot be re-initiated.
    assert _initiate(client, session, order_id).status_code == 409


async def test_a_payment_cannot_be_verified_by_another_user(
    client: TestClient, gateway: ScriptedGateway
) -> None:
    session, _ = _register_and_login(client)
    stranger, _ = _register_and_login(client)
    order_id = await _placed_order(client, session)
    payment_id = _initiate(client, session, order_id).json()["payment_id"]

    response = client.post(
        f"{API}/payments/verify",
        cookies={COOKIE: stranger},
        json={"reference": payment_id},
    )

    assert response.status_code == 404, response.text
    assert gateway.verified == []


async def test_payment_requests_are_validated(
    client: TestClient, gateway: ScriptedGateway
) -> None:
    session, _ = _register_and_login(client)

    # An authenticated call with a malformed body fails validation, not auth.
    assert (
        client.post(f"{API}/payments/initiate", cookies={COOKIE: session}, json={})
    ).status_code == 422
    assert (
        client.post(
            f"{API}/payments/verify", cookies={COOKIE: session}, json={"reference": "x"}
        )
    ).status_code == 422
