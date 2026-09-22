"""Persistence contracts for the authentication domain.

These abstract repositories are the boundary between the auth use-cases and
whatever storage is configured. Concrete SQLAlchemy implementations arrive with
the user-persistence phase; the domain depends only on these contracts.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.domains.auth.domain.entities import Credentials, User


class AbstractUserRepository(ABC):
    """Read/write `User` records."""

    @abstractmethod
    async def add(self, user: User) -> User:
        """Persist a new user and return it with its generated id."""

    @abstractmethod
    async def get_by_id(self, user_id: int) -> User | None:
        """Return the user with ``user_id`` or ``None``."""

    @abstractmethod
    async def get_by_email(self, email: str) -> User | None:
        """Return the user with ``email`` (normalised) or ``None``."""


class AbstractCredentialsRepository(ABC):
    """Read/write password `Credentials` records."""

    @abstractmethod
    async def add(self, credentials: Credentials) -> Credentials:
        """Persist credentials for a user."""

    @abstractmethod
    async def get_by_email(self, email: str) -> Credentials | None:
        """Return the credentials registered under ``email`` or ``None``."""

    @abstractmethod
    async def get_by_user_id(self, user_id: int) -> Credentials | None:
        """Return the credentials belonging to ``user_id`` or ``None``."""
