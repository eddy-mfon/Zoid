"""Payments HTTP endpoints.

Initiation and verification are customer operations on their own orders; refunds
are an order-management permission. No endpoint here knows which provider is
configured -- the response shape is the normalized contract in all cases.
"""

from __future__ import annotations

from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends

from app.domains.payments.api.schemas import (
    InitiatePaymentRequest,
    PaymentResponse,
    RefundPaymentRequest,
    VerifyPaymentRequest,
    serialize_initiation,
    serialize_refund,
    serialize_verification,
)
from app.domains.payments.application.service import PaymentService
from app.infrastructure.container import get_payment_service
from app.security.authorization import (
    Permission,
    Principal,
    require_authenticated_user,
    require_permission,
)

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/initiate", response_model=PaymentResponse)
async def initiate_payment(
    body: InitiatePaymentRequest,
    principal: Annotated[Principal, Depends(require_authenticated_user)],
    service: Annotated[PaymentService, Depends(get_payment_service)],
) -> PaymentResponse:
    """Start payment for one of the caller's pending orders."""
    transaction, initiation = await service.initiate(
        user_id=principal.user_id, order_id=body.order_id
    )
    return serialize_initiation(transaction, initiation)


@router.post("/verify", response_model=PaymentResponse)
async def verify_payment(
    body: VerifyPaymentRequest,
    principal: Annotated[Principal, Depends(require_authenticated_user)],
    service: Annotated[PaymentService, Depends(get_payment_service)],
) -> PaymentResponse:
    """Confirm a payment with the provider; the client's word is not accepted."""
    transaction, verification = await service.verify(
        user_id=principal.user_id, reference=body.reference
    )
    return serialize_verification(transaction, verification)


@router.post("/refunds", response_model=PaymentResponse)
async def refund_payment(
    body: RefundPaymentRequest,
    _: Annotated[Principal, Depends(require_permission(Permission.MANAGE_ORDERS))],
    service: Annotated[PaymentService, Depends(get_payment_service)],
) -> PaymentResponse:
    """Refund a settled payment (admin/order-management only)."""
    amount = Decimal(str(body.amount)) if body.amount is not None else None
    transaction, refund = await service.refund(
        reference=body.reference, amount=amount, reason=body.reason
    )
    return serialize_refund(transaction, refund)
