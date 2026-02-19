"""Admin listing moderation endpoints."""
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.listing import Listing, ListingStatus
from app.models.audit_log import AuditLog
from app.models.user import User
from app.api.deps import require_moderator, require_admin
from app.schemas.admin import (
    AdminListingResponse,
    AdminListingListResponse,
    ListingRejectRequest,
    PaginationMeta,
)

router = APIRouter()


@router.get("", response_model=AdminListingListResponse)
async def list_listings(
    status: Optional[str] = Query("moderation", description="Filter by status"),
    author_id: Optional[UUID] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    query = select(Listing).options(
        selectinload(Listing.author),
        selectinload(Listing.category),
        selectinload(Listing.images),
    )
    count_query = select(func.count(Listing.id))

    if status:
        query = query.where(Listing.status == status)
        count_query = count_query.where(Listing.status == status)
    if author_id:
        query = query.where(Listing.author_id == author_id)
        count_query = count_query.where(Listing.author_id == author_id)

    total = (await db.execute(count_query)).scalar() or 0

    query = query.order_by(Listing.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    listings = result.scalars().unique().all()

    total_pages = (total + per_page - 1) // per_page

    return AdminListingListResponse(
        data=[AdminListingResponse.model_validate(l) for l in listings],
        meta=PaginationMeta(page=page, per_page=per_page, total=total, total_pages=total_pages),
    )


@router.get("/{listing_id}", response_model=AdminListingResponse)
async def get_listing(
    listing_id: UUID,
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Listing)
        .where(Listing.id == listing_id)
        .options(
            selectinload(Listing.author),
            selectinload(Listing.category),
            selectinload(Listing.images),
        )
    )
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return AdminListingResponse.model_validate(listing)


@router.patch("/{listing_id}/approve", response_model=AdminListingResponse)
async def approve_listing(
    listing_id: UUID,
    request: Request,
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Listing)
        .where(Listing.id == listing_id)
        .options(
            selectinload(Listing.author),
            selectinload(Listing.category),
            selectinload(Listing.images),
        )
    )
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.status != ListingStatus.MODERATION.value:
        raise HTTPException(status_code=400, detail="Only listings with status 'moderation' can be approved")

    listing.status = ListingStatus.ACTIVE.value
    listing.published_at = datetime.now(timezone.utc)
    listing.reject_reason = None

    db.add(AuditLog(
        user_id=current_user.id,
        action="listing.approve",
        entity_type="listing",
        entity_id=str(listing_id),
        details={"title": listing.title},
        ip_address=request.client.host if request.client else None,
    ))

    await db.commit()
    await db.refresh(listing)
    return AdminListingResponse.model_validate(listing)


@router.patch("/{listing_id}/reject", response_model=AdminListingResponse)
async def reject_listing(
    listing_id: UUID,
    body: ListingRejectRequest,
    request: Request,
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Listing)
        .where(Listing.id == listing_id)
        .options(
            selectinload(Listing.author),
            selectinload(Listing.category),
            selectinload(Listing.images),
        )
    )
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.status != ListingStatus.MODERATION.value:
        raise HTTPException(status_code=400, detail="Only listings with status 'moderation' can be rejected")

    listing.status = ListingStatus.REJECTED.value
    listing.reject_reason = body.reason

    db.add(AuditLog(
        user_id=current_user.id,
        action="listing.reject",
        entity_type="listing",
        entity_id=str(listing_id),
        details={"title": listing.title, "reason": body.reason},
        ip_address=request.client.host if request.client else None,
    ))

    await db.commit()
    await db.refresh(listing)
    return AdminListingResponse.model_validate(listing)


@router.delete("/{listing_id}", status_code=204)
async def delete_listing(
    listing_id: UUID,
    request: Request,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    title = listing.title
    await db.delete(listing)

    db.add(AuditLog(
        user_id=current_user.id,
        action="listing.delete",
        entity_type="listing",
        entity_id=str(listing_id),
        details={"title": title},
        ip_address=request.client.host if request.client else None,
    ))

    await db.commit()
