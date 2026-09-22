"""Unit of Work — the transactional boundary for write use-cases.

`AbstractUnitOfWork` is the framework-free contract application services depend
on. `SqlAlchemyUnitOfWork` is the concrete implementation; repositories are
attached to it in later phases as domains are introduced.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from types import TracebackType
from typing import Self

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.domains.auth.domain.repositories import AbstractCredentialsRepository
from app.domains.users.domain.repositories import AbstractUserRepository
from app.infrastructure.persistence.sqlalchemy.repositories import (
    SqlCredentialsRepository,
    SqlUserRepository,
)


class AbstractUnitOfWork:
    """Contract for a transactional unit of work.

    A framework-free marker that application services depend on. Repositories
    are declared here and instantiated by the concrete implementation as
    domains land (more are added in later phases: products, cart, orders,
    payments).
    """

    users: AbstractUserRepository
    credentials: AbstractCredentialsRepository


class SqlAlchemyUnitOfWork(AbstractUnitOfWork):
    def __init__(self, sessionmaker: async_sessionmaker[AsyncSession]) -> None:
        self._sessionmaker = sessionmaker
        self.session: AsyncSession

    async def __aenter__(self) -> Self:
        self.session = self._sessionmaker()
        # Begin an explicit transaction so commit/rollback are well defined.
        await self.session.begin()
        self.users = SqlUserRepository(self.session)
        self.credentials = SqlCredentialsRepository(self.session)
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        if exc_type is not None:
            await self.session.rollback()
        await self.session.close()

    async def commit(self) -> None:
        await self.session.commit()

    async def rollback(self) -> None:
        await self.session.rollback()


@asynccontextmanager
async def unit_of_work(
    sessionmaker: async_sessionmaker[AsyncSession],
) -> AsyncIterator[SqlAlchemyUnitOfWork]:
    """Convenience context manager yielding a begun Unit of Work."""
    uow = SqlAlchemyUnitOfWork(sessionmaker)
    async with uow:
        yield uow
