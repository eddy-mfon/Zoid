"""Persistence contracts for the products domain."""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.domains.products.domain.entities import Category, Product


class AbstractProductRepository(ABC):
    """Read/write the product catalog."""

    @abstractmethod
    async def add(self, product: Product) -> Product:
        """Persist a new product (with images/variants/inventory) and return it."""

    @abstractmethod
    async def get_by_id(self, product_id: int) -> Product | None:
        """Return the product with ``product_id`` or ``None``."""

    @abstractmethod
    async def get_by_slug(self, slug: str) -> Product | None:
        """Return the product with ``slug`` or ``None``."""

    @abstractmethod
    async def list_active(self, *, limit: int, offset: int) -> list[Product]:
        """Return a page of active products."""

    @abstractmethod
    async def count_active(self) -> int:
        """Total number of active products."""


class AbstractCategoryRepository(ABC):
    """Read/write catalog categories."""

    @abstractmethod
    async def add(self, category: Category) -> Category:
        """Persist a new category and return it with its generated id."""

    @abstractmethod
    async def list(self) -> list[Category]:
        """Return all categories."""
