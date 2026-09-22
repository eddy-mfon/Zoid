"""Persistence contracts for the users domain.

The canonical `AbstractUserRepository`. The authentication domain re-exports it
(it needs the same reads plus credential storage) so there is exactly one user
aggregate and one repository contract for it.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.domains.users.domain.entities import User


class AbstractUserRepository(ABC):
    """Read/write `User` records."""

    @abstractmethod
    async def add(self, user: User) -> User:
        """Persist a new user and return it with its generated id/role."""

    @abstractmethod
    async def get_by_id(self, user_id: int) -> User | None:
        """Return the user with ``user_id`` or ``None``."""

    @abstractmethod
    async def get_by_email(self, email: str) -> User | None:
        """Return the user with ``email`` (normalised) or ``None``."""

    @abstractmethod
    async def update_profile(
        self,
        user_id: int,
        *,
        name: str | None = None,
        phone: str | None = None,
    ) -> User | None:
        """Apply non-``None`` profile changes to ``user_id``; return the user or ``None``."""
