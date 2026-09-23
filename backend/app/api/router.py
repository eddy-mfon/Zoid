"""Aggregate v1 API router.

Each domain contributes its router here; the composition stays one line per
domain so `main.py` never needs to know about individual feature routers.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.domains.auth.api.router import router as auth_router
from app.domains.cart.api.router import router as cart_router
from app.domains.products.api.router import router as products_router
from app.domains.users.api.router import router as users_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(cart_router)
api_router.include_router(users_router)
api_router.include_router(products_router)

__all__ = ["api_router"]
