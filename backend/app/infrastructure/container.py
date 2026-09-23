"""Composition root.

Wires concrete implementations to the abstractions the application and domains
depend on, driven entirely by configuration. This is the only layer allowed to
know about every concrete class at once.
"""

from __future__ import annotations

from collections.abc import AsyncIterator

from fastapi import Depends

from app.domains.auth.application.service import AuthService
from app.domains.cart.application.service import CartService
from app.domains.orders.application.service import OrderService
from app.domains.products.application.service import ProductService
from app.domains.users.application.service import UserService
from app.domains.wishlist.application.service import WishlistService
from app.infrastructure.persistence.sqlalchemy.session import get_sessionmaker
from app.infrastructure.persistence.sqlalchemy.unit_of_work import (
    AbstractUnitOfWork,
    SqlAlchemyUnitOfWork,
)
from app.security.authentication.dependencies import (
    get_session_service,
    get_session_strategy,
)
from app.security.authentication.service import SessionService
from app.security.authentication.session import AbstractSessionStrategy
from app.security.password import PasswordHasher, get_password_hasher


def build_session_strategy() -> AbstractSessionStrategy:
    """The configured session strategy (JWT-cookie today)."""
    return get_session_strategy()


def build_session_service() -> SessionService:
    """The configured cookie-delivery service."""
    return get_session_service()


def build_password_hasher() -> PasswordHasher:
    """The configured password hasher (Argon2 today)."""
    return get_password_hasher()


def build_unit_of_work() -> SqlAlchemyUnitOfWork:
    """A Unit of Work bound to the shared session factory."""
    return SqlAlchemyUnitOfWork(get_sessionmaker())


async def get_unit_of_work() -> AsyncIterator[AbstractUnitOfWork]:
    """FastAPI dependency: one Unit of Work per request.

    The transaction begun by the context manager is committed on a successful
    response and rolled back automatically if the request raises.
    """
    async with build_unit_of_work() as uow:
        yield uow
        await uow.commit()


async def get_auth_service(
    uow: AbstractUnitOfWork = Depends(get_unit_of_work),
) -> AuthService:
    """The auth use-case orchestrator wired to persistence."""
    return AuthService(
        users=uow.users,
        credentials=uow.credentials,
        hasher=build_password_hasher(),
        session=get_session_strategy(),
    )


async def get_user_service(
    uow: AbstractUnitOfWork = Depends(get_unit_of_work),
) -> UserService:
    """The self-service profile use-case orchestrator."""
    return UserService(uow.users)


async def get_product_service(
    uow: AbstractUnitOfWork = Depends(get_unit_of_work),
) -> ProductService:
    """The public catalog use-case orchestrator."""
    return ProductService(products=uow.products, categories=uow.categories)


async def get_cart_service(
    uow: AbstractUnitOfWork = Depends(get_unit_of_work),
) -> CartService:
    """The guest/authenticated cart use-case orchestrator."""
    return CartService(carts=uow.carts, products=uow.products)


async def get_wishlist_service(
    uow: AbstractUnitOfWork = Depends(get_unit_of_work),
) -> WishlistService:
    """The per-user wishlist use-case orchestrator."""
    return WishlistService(wishlists=uow.wishlists, products=uow.products)


async def get_order_service(
    uow: AbstractUnitOfWork = Depends(get_unit_of_work),
) -> OrderService:
    """The checkout/order use-case orchestrator (cart -> validated order)."""
    return OrderService(orders=uow.orders, carts=uow.carts, products=uow.products)
