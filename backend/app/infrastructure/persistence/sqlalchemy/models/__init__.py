"""ORM models package.

Import every model module here so `Base.metadata` is fully populated for
Alembic autogeneration. Add new models as their domains land.
"""

from app.infrastructure.persistence.sqlalchemy.models.address import AddressRow
from app.infrastructure.persistence.sqlalchemy.models.cart import CartRow
from app.infrastructure.persistence.sqlalchemy.models.cart_item import CartItemRow
from app.infrastructure.persistence.sqlalchemy.models.category import CategoryRow
from app.infrastructure.persistence.sqlalchemy.models.credential import CredentialRow
from app.infrastructure.persistence.sqlalchemy.models.inventory import InventoryRow
from app.infrastructure.persistence.sqlalchemy.models.product import ProductRow
from app.infrastructure.persistence.sqlalchemy.models.product_image import (
    ProductImageRow,
)
from app.infrastructure.persistence.sqlalchemy.models.product_variant import (
    ProductVariantRow,
)
from app.infrastructure.persistence.sqlalchemy.models.role import RoleRow
from app.infrastructure.persistence.sqlalchemy.models.user import UserRow
from app.infrastructure.persistence.sqlalchemy.session import Base

__all__ = [
    "Base",
    "AddressRow",
    "CartRow",
    "CartItemRow",
    "CategoryRow",
    "CredentialRow",
    "InventoryRow",
    "ProductImageRow",
    "ProductRow",
    "ProductVariantRow",
    "RoleRow",
    "UserRow",
]
