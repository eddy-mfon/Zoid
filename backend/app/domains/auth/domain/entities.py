"""Auth domain entities.

Plain, framework-free objects. Persistence and HTTP representations map to and
from these; the domain itself imports neither.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime


@dataclass
class User:
    """An authenticated principal."""

    id: int
    email: str
    name: str
    phone: str | None = None
    role: str = "customer"
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))


@dataclass
class Credentials:
    """A stored password credential, keyed by email and linked to a user."""

    email: str
    password_hash: str
    user_id: int | None = None
