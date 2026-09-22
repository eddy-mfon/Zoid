"""ORM models package.

Import every model module here so `Base.metadata` is fully populated for
Alembic autogeneration. Add new models as their domains land.
"""

from app.infrastructure.persistence.sqlalchemy.models.address import AddressRow
from app.infrastructure.persistence.sqlalchemy.models.credential import CredentialRow
from app.infrastructure.persistence.sqlalchemy.models.role import RoleRow
from app.infrastructure.persistence.sqlalchemy.models.user import UserRow
from app.infrastructure.persistence.sqlalchemy.session import Base

__all__ = ["Base", "AddressRow", "CredentialRow", "RoleRow", "UserRow"]
