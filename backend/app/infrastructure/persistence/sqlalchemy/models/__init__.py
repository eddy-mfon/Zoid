"""ORM models package.

Import every model module here so `Base.metadata` is fully populated for
Alembic autogeneration. Models are added as their domains land in later
phases (user, credential, role, address, product, category, product_image,
product_variant, inventory, cart, cart_item, wishlist, wishlist_item, order,
order_item, transaction, refund, webhook_event).
"""

from app.infrastructure.persistence.sqlalchemy.session import Base

__all__ = ["Base"]
