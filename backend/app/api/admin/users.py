"""Admin user management endpoints."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.models.listing import Listing
from app.models.audit_log import AuditLog
from app.api.deps import require_moderator
from app.schemas.admin import (
    AdminUserResponse,
    AdminUserListResponse,
    AdminUserUpdateRequest,
    PaginationMeta,
)

router = APIRouter()


@router.get("", response_model=AdminUserListResponse)
async def list_users(
    q: Optional[str] = Query(None, description="Search by email or name"),
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    query = select(User)
    count_query = select(func.count(User.id))

    if q:
        pattern = f"%{q}%"
        filter_cond = or_(User.email.ilike(pattern), User.display_name.ilike(pattern))
        query = query.where(filter_cond)
        count_query = count_query.where(filter_cond)
    if role:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.is_active == is_active)
        count_query = count_query.where(User.is_active == is_active)

    total = (await db.execute(count_query)).scalar() or 0

    query = query.order_by(User.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    users = result.scalars().all()

    # Get listing counts
    user_ids = [u.id for u in users]
    listings_counts: dict[UUID, int] = {}
    if user_ids:
        rows = (
            await db.execute(
                select(Listing.author_id, func.count(Listing.id))
                .where(Listing.author_id.in_(user_ids))
                .group_by(Listing.author_id)
            )
        ).all()
        listings_counts = {r[0]: r[1] for r in rows}

    total_pages = (total + per_page - 1) // per_page

    data = []
    for u in users:
        resp = AdminUserResponse.model_validate(u)
        resp.listings_count = listings_counts.get(u.id, 0)
        data.append(resp)

    return AdminUserListResponse(
        data=data,
        meta=PaginationMeta(page=page, per_page=per_page, total=total, total_pages=total_pages),
    )


@router.get("/{user_id}", response_model=AdminUserResponse)
async def get_user(
    user_id: UUID,
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    listings_count = (
        await db.execute(
            select(func.count(Listing.id)).where(Listing.author_id == user_id)
        )
    ).scalar() or 0

    resp = AdminUserResponse.model_validate(user)
    resp.listings_count = listings_count
    return resp


@router.patch("/{user_id}", response_model=AdminUserResponse)
async def update_user(
    user_id: UUID,
    body: AdminUserUpdateRequest,
    request: Request,
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    details: dict = {}

    if body.role is not None:
        if body.role == UserRole.ADMIN.value and current_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Only admins can promote users to admin role")
        old_role = user.role.value if hasattr(user.role, "value") else user.role
        details["role"] = {"from": old_role, "to": body.role}
        user.role = body.role

    if body.is_active is not None:
        if user.id == current_user.id and not body.is_active:
            raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
        details["is_active"] = {"from": user.is_active, "to": body.is_active}
        user.is_active = body.is_active

    if details:
        db.add(AuditLog(
            user_id=current_user.id,
            action="user.update",
            entity_type="user",
            entity_id=str(user_id),
            details=details,
            ip_address=request.client.host if request.client else None,
        ))

    await db.commit()
    await db.refresh(user)

    listings_count = (
        await db.execute(
            select(func.count(Listing.id)).where(Listing.author_id == user_id)
        )
    ).scalar() or 0

    resp = AdminUserResponse.model_validate(user)
    resp.listings_count = listings_count
    return resp
