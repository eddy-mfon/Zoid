"""Contracts the orders domain requires from persistence."""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.domains.orders.domain.entities import Order


class AbstractOrderRepository(ABC):
    """Persist and read order aggregates."""

    @abstractmethod
    async def add(self, order: Order) -> Order:
        """Store a new order with its lines and return it with ids assigned."""

    @abstractmethod
    async def get_by_id(self, order_id: int) -> Order | None:
        """Load an order (with its lines) by primary key."""

    @abstractmethod
    async def list_by_user_id(self, user_id: int) -> list[Order]:
        """Return a user's orders, newest first."""

    @abstractmethod
    async def save(self, order: Order) -> Order:
        """Persist changes made to a loaded order (status, notes)."""
