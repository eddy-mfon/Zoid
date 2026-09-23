"""Contracts the payments domain requires from persistence."""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.domains.payments.domain.entities import Transaction


class AbstractTransactionRepository(ABC):
    """Persist and read payment transactions."""

    @abstractmethod
    async def add(self, transaction: Transaction) -> Transaction:
        """Store a new transaction and return it with its id assigned."""

    @abstractmethod
    async def get_by_id(self, transaction_id: int) -> Transaction | None:
        """Load a transaction by primary key."""

    @abstractmethod
    async def get_by_reference(self, reference: str) -> Transaction | None:
        """Load a transaction by the internal reference handed to the provider."""

    @abstractmethod
    async def get_latest_by_order_id(self, order_id: int) -> Transaction | None:
        """Most recent transaction for an order, or ``None`` if it was never paid."""

    @abstractmethod
    async def save(self, transaction: Transaction) -> Transaction:
        """Persist changes made to a loaded transaction."""
