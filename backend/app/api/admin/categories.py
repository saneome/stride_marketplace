"""Admin category management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.category import Category
from app.models.listing import Listing
from app.models.audit_log import AuditLog
from app.models.user import User
from app.api.deps import require_admin
from app.schemas.admin import (
    AdminCategoryResponse,
    AdminCategoryListResponse,
    CategoryCreateRequest,
    CategoryUpdateRequest,
)

router = APIRouter()


@router.get("", response_model=AdminCategoryListResponse)
async def list_categories(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(
            Category,
            func.count(Listing.id).label("cnt"),
        )
        .outerjoin(Listing, Listing.category_id == Category.id)
        .group_by(Category.id)
        .order_by(Category.sort_order)
    )
    rows = result.all()

    data = []
    for cat, cnt in rows:
        resp = AdminCategoryResponse.model_validate(cat)
        resp.listings_count = cnt
        data.append(resp)

    return AdminCategoryListResponse(data=data)


@router.post("", response_model=AdminCategoryResponse, status_code=201)
async def create_category(
    body: CategoryCreateRequest,
    request: Request,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(Category).where(Category.slug == body.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Category with this slug already exists")

    category = Category(
        name=body.name,
        slug=body.slug,
        description=body.description,
        parent_id=body.parent_id,
        icon=body.icon,
        sort_order=body.sort_order,
        is_active=body.is_active,
    )
    db.add(category)

    db.add(AuditLog(
        user_id=current_user.id,
        action="category.create",
        entity_type="category",
        entity_id="",
        details={"name": body.name, "slug": body.slug},
        ip_address=request.client.host if request.client else None,
    ))

    await db.commit()
    await db.refresh(category)

    resp = AdminCategoryResponse.model_validate(category)
    resp.listings_count = 0
    return resp


@router.patch("/{category_id}", response_model=AdminCategoryResponse)
async def update_category(
    category_id: int,
    body: CategoryUpdateRequest,
    request: Request,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    details: dict = {}
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        old_val = getattr(category, field)
        if old_val != value:
            details[field] = {"from": old_val, "to": value}
            setattr(category, field, value)

    if details:
        db.add(AuditLog(
            user_id=current_user.id,
            action="category.update",
            entity_type="category",
            entity_id=str(category_id),
            details=details,
            ip_address=request.client.host if request.client else None,
        ))

    await db.commit()
    await db.refresh(category)

    listings_count = (
        await db.execute(
            select(func.count(Listing.id)).where(Listing.category_id == category_id)
        )
    ).scalar() or 0

    resp = AdminCategoryResponse.model_validate(category)
    resp.listings_count = listings_count
    return resp


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    request: Request,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    active_count = (
        await db.execute(
            select(func.count(Listing.id)).where(
                Listing.category_id == category_id,
                Listing.status.in_(["active", "moderation"]),
            )
        )
    ).scalar() or 0

    if active_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category with {active_count} active/moderation listings",
        )

    name = category.name
    await db.delete(category)

    db.add(AuditLog(
        user_id=current_user.id,
        action="category.delete",
        entity_type="category",
        entity_id=str(category_id),
        details={"name": name},
        ip_address=request.client.host if request.client else None,
    ))

    await db.commit()
