"""Composition root.

Wires concrete implementations to the abstractions the application and domains
depend on, driven entirely by configuration. This is the only layer allowed to
know about every concrete class at once.
"""

from __future__ import annotations

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
