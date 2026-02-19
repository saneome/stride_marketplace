"""Pydantic schemas for admin API."""
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


# ── Pagination ──────────────────────────────────────────────────

class PaginationMeta(BaseModel):
    page: int
    per_page: int
    total: int
    total_pages: int


# ── Users ───────────────────────────────────────────────────────

class AdminUserResponse(BaseModel):
    id: UUID
    email: str
    phone: Optional[str] = None
    display_name: str
    avatar_url: Optional[str] = None
    role: str
    is_active: bool
    totp_enabled: bool
    created_at: datetime
    updated_at: datetime
    listings_count: int = 0

    class Config:
        from_attributes = True


class AdminUserListResponse(BaseModel):
    data: list[AdminUserResponse]
    meta: PaginationMeta


class AdminUserUpdateRequest(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None


# ── Listing images ──────────────────────────────────────────────

class ListingImageResponse(BaseModel):
    id: UUID
    url: str
    thumbnail_url: Optional[str] = None
    sort_order: int
    is_cover: bool

    class Config:
        from_attributes = True


# ── Listings ────────────────────────────────────────────────────

class ListingAuthorBrief(BaseModel):
    id: UUID
    email: str
    display_name: str

    class Config:
        from_attributes = True


class CategoryBrief(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class AdminListingResponse(BaseModel):
    id: UUID
    title: str
    description: str
    price: Decimal
    currency: str
    condition: str
    status: str
    reject_reason: Optional[str] = None
    location: str
    views_count: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    author: ListingAuthorBrief
    category: CategoryBrief
    images: list[ListingImageResponse] = []

    class Config:
        from_attributes = True


class AdminListingListResponse(BaseModel):
    data: list[AdminListingResponse]
    meta: PaginationMeta


class ListingRejectRequest(BaseModel):
    reason: str = Field(..., min_length=1, max_length=1000)


# ── Categories ──────────────────────────────────────────────────

class AdminCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    icon: Optional[str] = None
    sort_order: int
    is_active: bool
    listings_count: int = 0

    class Config:
        from_attributes = True


class AdminCategoryListResponse(BaseModel):
    data: list[AdminCategoryResponse]


class CategoryCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[int] = None
    icon: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class CategoryUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[int] = None
    icon: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


# ── Audit ───────────────────────────────────────────────────────

class AuditLogUserBrief(BaseModel):
    id: UUID
    email: str
    display_name: str

    class Config:
        from_attributes = True


class AuditLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    action: str
    entity_type: str
    entity_id: str
    details: Optional[dict] = None
    ip_address: Optional[str] = None
    created_at: datetime
    user: Optional[AuditLogUserBrief] = None

    class Config:
        from_attributes = True


class AuditLogListResponse(BaseModel):
    data: list[AuditLogResponse]
    meta: PaginationMeta


# ── Stats (dashboard) ──────────────────────────────────────────

class ListingsByStatus(BaseModel):
    draft: int = 0
    moderation: int = 0
    active: int = 0
    rejected: int = 0
    sold: int = 0
    archived: int = 0


class PeriodStats(BaseModel):
    today: int = 0
    week: int = 0
    month: int = 0


class TopCategory(BaseModel):
    id: int
    name: str
    slug: str
    count: int


class DashboardStatsResponse(BaseModel):
    listings_by_status: ListingsByStatus
    new_users: PeriodStats
    new_listings: PeriodStats
    total_users: int
    total_listings: int
    top_categories: list[TopCategory] = []
