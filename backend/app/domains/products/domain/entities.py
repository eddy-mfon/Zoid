"""Product catalog domain entities and business rules.

Plain, framework-free objects. Validation lives here as explicit ``validate()``
rules (raised as the shared ``ValidationError``) so it is enforced on the write
path and unit-testable without any database or HTTP involvement — reads of
existing rows do not re-run them.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from decimal import Decimal

from app.shared.exceptions import ValidationError

IMAGE_VIEWS = frozenset({"front", "back", "detail"})


@dataclass(frozen=True)
class Category:
    """A catalog grouping for products."""

    id: int
    name: str
    slug: str

    def validate(self) -> None:
        if not self.name.strip():
            raise ValidationError("Category name is required.")
        if not self.slug.strip():
            raise ValidationError("Category slug is required.")


@dataclass(frozen=True)
class ProductImage:
    """One gallery image; ``view`` is front/back/detail."""

    url: str
    view: str = "front"

    def validate(self) -> None:
        if not self.url.strip():
            raise ValidationError("Product image URL is required.")
        if self.view not in IMAGE_VIEWS:
            raise ValidationError(f"Invalid image view: {self.view!r}.")


@dataclass
class Inventory:
    """Stock counts for a single variant."""

    quantity: int = 0
    reserved: int = 0

    @property
    def available(self) -> int:
        return self.quantity - self.reserved

    def validate(self) -> None:
        if self.quantity < 0:
            raise ValidationError("Inventory quantity cannot be negative.")
        if self.reserved < 0:
            raise ValidationError("Inventory reservation cannot be negative.")
        if self.reserved > self.quantity:
            raise ValidationError("Reserved stock cannot exceed available quantity.")


@dataclass
class ProductVariant:
    """A purchasable size variant of a product, carrying its inventory."""

    id: int
    sku: str
    size: str
    inventory: Inventory = field(default_factory=Inventory)

    def validate(self) -> None:
        if not self.sku.strip():
            raise ValidationError("Variant SKU is required.")
        if not self.size.strip():
            raise ValidationError("Variant size is required.")
        self.inventory.validate()


@dataclass
class Product:
    """A catalog product and its images, variants and inventory."""

    id: int
    slug: str
    name: str
    category: Category
    price: Decimal
    currency: str = "NGN"
    images: list[ProductImage] = field(default_factory=list)
    variants: list[ProductVariant] = field(default_factory=list)
    tone: str = ""
    style: str = ""
    color: str = ""
    fit: str = ""
    fit_note: str = ""
    details: str = ""
    delivery: str = ""
    is_bestseller: bool = False
    is_special: bool = False
    is_active: bool = True
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    @property
    def sizes(self) -> list[str]:
        return [variant.size for variant in self.variants]

    @property
    def stock(self) -> dict[str, int]:
        return {variant.size: variant.inventory.available for variant in self.variants}

    @property
    def primary_image(self) -> str | None:
        return self.images[0].url if self.images else None

    def validate(self) -> None:
        if not self.slug.strip():
            raise ValidationError("Product slug is required.")
        if not self.name.strip():
            raise ValidationError("Product name is required.")
        if self.price < 0:
            raise ValidationError("Product price cannot be negative.")
        if not self.currency.strip():
            raise ValidationError("Product currency is required.")
        self.category.validate()
        for image in self.images:
            image.validate()
        for variant in self.variants:
            variant.validate()
