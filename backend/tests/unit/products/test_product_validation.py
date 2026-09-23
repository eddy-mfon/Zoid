"""Domain business-rule validation — product, variant, inventory, image.

Proves the catalog rules are enforced in the domain, with no database or HTTP.
"""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.domains.products.domain.entities import (
    Category,
    Inventory,
    Product,
    ProductImage,
    ProductVariant,
)
from app.shared.exceptions import ValidationError


def _product(**overrides: object) -> Product:
    base: dict[str, object] = {
        "id": 0,
        "slug": "ac-milan-2526",
        "name": "AC Milan / 25—26",
        "category": Category(id=1, name="Curated Jersey", slug="curated-jersey"),
        "price": Decimal("58500.00"),
        "images": [ProductImage(url="/i/front.jpg", view="front")],
        "variants": [
            ProductVariant(id=1, sku="ACM-M", size="M", inventory=Inventory(quantity=8))
        ],
    }
    base.update(overrides)
    return Product(**base)  # type: ignore[arg-type]


def test_valid_product_passes_validation() -> None:
    _product().validate()  # must not raise


def test_product_requires_name_and_slug() -> None:
    with pytest.raises(ValidationError):
        _product(name="   ").validate()
    with pytest.raises(ValidationError):
        _product(slug="").validate()


def test_product_price_cannot_be_negative() -> None:
    with pytest.raises(ValidationError):
        _product(price=Decimal("-1")).validate()


def test_product_currency_required() -> None:
    with pytest.raises(ValidationError):
        _product(currency="  ").validate()


def test_variant_requires_size_and_sku() -> None:
    with pytest.raises(ValidationError):
        _product(
            variants=[ProductVariant(id=1, sku=" ", size="M", inventory=Inventory())]
        ).validate()
    with pytest.raises(ValidationError):
        _product(
            variants=[ProductVariant(id=1, sku="ACM-M", size=" ", inventory=Inventory())]
        ).validate()


def test_inventory_quantity_cannot_be_negative() -> None:
    with pytest.raises(ValidationError):
        Inventory(quantity=-1).validate()


def test_inventory_reserved_cannot_exceed_quantity() -> None:
    with pytest.raises(ValidationError):
        Inventory(quantity=2, reserved=5).validate()


def test_inventory_available_is_quantity_minus_reserved() -> None:
    assert Inventory(quantity=10, reserved=3).available == 7


def test_propagates_variant_inventory_rule_through_product() -> None:
    product = _product(
        variants=[
            ProductVariant(id=1, sku="ACM-L", size="L", inventory=Inventory(quantity=1, reserved=4))
        ]
    )
    with pytest.raises(ValidationError):
        product.validate()


def test_image_rejects_unknown_view() -> None:
    with pytest.raises(ValidationError):
        _product(images=[ProductImage(url="/i/x.jpg", view="side")]).validate()


def test_image_requires_url() -> None:
    with pytest.raises(ValidationError):
        _product(images=[ProductImage(url="  ", view="front")]).validate()


def test_stock_and_sizes_derive_from_variants() -> None:
    product = _product(
        variants=[
            ProductVariant(
                id=1,
                sku="ACM-M",
                size="M",
                inventory=Inventory(quantity=8, reserved=2),
            ),
            ProductVariant(id=2, sku="ACM-L", size="L", inventory=Inventory(quantity=3)),
        ]
    )
    assert product.sizes == ["M", "L"]
    assert product.stock == {"M": 6, "L": 3}  # available, not raw quantity
