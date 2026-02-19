"""Admin dashboard statistics endpoints."""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.category import Category
from app.api.deps import require_moderator
from app.schemas.admin import (
    DashboardStatsResponse,
    ListingsByStatus,
    PeriodStats,
    TopCategory,
)

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    current_user: User = Depends(require_moderator),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=today_start.weekday())
    month_start = today_start.replace(day=1)

    # Listings by status
    status_rows = (
        await db.execute(
            select(Listing.status, func.count()).group_by(Listing.status)
        )
    ).all()
    status_map = {row[0]: row[1] for row in status_rows}

    listings_by_status = ListingsByStatus(
        draft=status_map.get("draft", 0),
        moderation=status_map.get("moderation", 0),
        active=status_map.get("active", 0),
        rejected=status_map.get("rejected", 0),
        sold=status_map.get("sold", 0),
        archived=status_map.get("archived", 0),
    )

    # Total counts
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    total_listings = (await db.execute(select(func.count(Listing.id)))).scalar() or 0

    # New users by period
    new_users_today = (
        await db.execute(
            select(func.count(User.id)).where(User.created_at >= today_start)
        )
    ).scalar() or 0
    new_users_week = (
        await db.execute(
            select(func.count(User.id)).where(User.created_at >= week_start)
        )
    ).scalar() or 0
    new_users_month = (
        await db.execute(
            select(func.count(User.id)).where(User.created_at >= month_start)
        )
    ).scalar() or 0

    # New listings by period
    new_listings_today = (
        await db.execute(
            select(func.count(Listing.id)).where(Listing.created_at >= today_start)
        )
    ).scalar() or 0
    new_listings_week = (
        await db.execute(
            select(func.count(Listing.id)).where(Listing.created_at >= week_start)
        )
    ).scalar() or 0
    new_listings_month = (
        await db.execute(
            select(func.count(Listing.id)).where(Listing.created_at >= month_start)
        )
    ).scalar() or 0

    # Top categories
    top_rows = (
        await db.execute(
            select(Category.id, Category.name, Category.slug, func.count(Listing.id).label("cnt"))
            .join(Listing, Listing.category_id == Category.id)
            .group_by(Category.id)
            .order_by(func.count(Listing.id).desc())
            .limit(10)
        )
    ).all()
    top_categories = [
        TopCategory(id=r[0], name=r[1], slug=r[2], count=r[3]) for r in top_rows
    ]

    return DashboardStatsResponse(
        listings_by_status=listings_by_status,
        new_users=PeriodStats(today=new_users_today, week=new_users_week, month=new_users_month),
        new_listings=PeriodStats(today=new_listings_today, week=new_listings_week, month=new_listings_month),
        total_users=total_users,
        total_listings=total_listings,
        top_categories=top_categories,
    )
