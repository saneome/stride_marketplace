from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.listing import Listing, ListingStatus, ListingCondition
from app.models.category import Category
from app.models.user import User
from app.security import get_current_user

router = APIRouter()
security = HTTPBearer(auto_error=False)


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated"""
    if not credentials:
        return None
    try:
        return await get_current_user(credentials.credentials, db)
    except HTTPException:
        return None


class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    currency: str = "RUB"
    condition: str
    category_id: int
    location: str


class ListingResponse(BaseModel):
    id: str
    title: str
    description: str
    price: float
    currency: str
    condition: str
    category: str
    category_id: int
    location: str | None
    imageUrl: str | None
    status: str
    viewsCount: int
    createdAt: str
    seller: dict | None

    class Config:
        from_attributes = True


class ListingListResponse(BaseModel):
    items: list[ListingResponse]
    total: int
    page: int
    per_page: int
    pages: int


def get_condition_label(condition: str) -> str:
    labels = {
        "new": "Новый",
        "like_new": "Как новый",
        "good": "Хорошее",
        "fair": "Удовлетворительное",
        "poor": "Б/у",
        "for_parts": "На запчасти",
    }
    return labels.get(condition, condition)


def needs_moderation(condition: str) -> bool:
    """Б/у товары требуют модерации, новые - сразу активны"""
    return condition in ["used", "for_parts", "good", "fair", "poor"]


@router.get("", response_model=ListingListResponse)
async def get_listings(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = None,
    status_filter: Optional[str] = "active",
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
):
    """Получить список объявлений"""
    # Only show active listings by default
    status_enum = ListingStatus(status_filter) if status_filter else ListingStatus.ACTIVE
    
    query = select(Listing).where(Listing.status == status_enum)
    
    if category:
        query = query.where(Listing.category.has(Category.slug == category))
    
    if search:
        query = query.where(
            (Listing.title.ilike(f"%{search}%")) |
            (Listing.description.ilike(f"%{search}%"))
        )
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    
    # Add pagination
    query = query.offset((page - 1) * per_page).limit(per_page)
    query = query.order_by(Listing.created_at.desc())
    
    result = await db.execute(query)
    listings = result.scalars().all()
    
    items = []
    for listing in listings:
        first_image = listing.images[0].url if listing.images else None
        
        category_name = listing.category.name if listing.category else None
        
        seller_data = None
        if listing.author:
            seller_data = {
                "id": str(listing.author.id),
                "firstName": listing.author.first_name,
            }
        
        items.append(ListingResponse(
            id=str(listing.id),
            title=listing.title,
            description=listing.description,
            price=float(listing.price),
            currency=listing.currency,
            condition=get_condition_label(listing.condition.value if hasattr(listing.condition, 'value') else listing.condition),
            category=category_name,
            category_id=listing.category_id,
            location=listing.location,
            imageUrl=first_image,
            status=listing.status.value if hasattr(listing.status, 'value') else listing.status,
            viewsCount=listing.views_count,
            createdAt=listing.created_at.isoformat() if listing.created_at else "",
            seller=seller_data,
        ))
    
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    
    return ListingListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=pages,
    )


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Получить одно объявление"""
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.category), selectinload(Listing.author))
        .where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Объявление не найдено")
    
    # Increment views
    listing.views_count += 1
    await db.commit()
    
    first_image = listing.images[0].url if listing.images else None
    category_name = listing.category.name if listing.category else None
    
    seller_data = None
    if listing.author:
        seller_data = {
            "id": str(listing.author.id),
            "firstName": listing.author.first_name,
        }
    
    return ListingResponse(
        id=str(listing.id),
        title=listing.title,
        description=listing.description,
        price=float(listing.price),
        currency=listing.currency,
        condition=get_condition_label(listing.condition.value if hasattr(listing.condition, 'value') else listing.condition),
        category=category_name,
        category_id=listing.category_id,
        location=listing.location,
        imageUrl=first_image,
        status=listing.status.value if hasattr(listing.status, 'value') else listing.status,
        viewsCount=listing.views_count,
        createdAt=listing.created_at.isoformat() if listing.created_at else "",
        seller=seller_data,
    )


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    listing_data: ListingCreate,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: AsyncSession = Depends(get_db),
):
    """Создать объявление"""
    current_user = await get_current_user(credentials.credentials, db)
    
    # Check category exists
    result = await db.execute(select(Category).where(Category.id == listing_data.category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=400, detail="Категория не найдена")
    
    # Determine status based on condition
    # Новые товары (new, like_new) - сразу активны
    # Б/у товары - на модерацию
    if needs_moderation(listing_data.condition):
        listing_status = ListingStatus.MODERATION
    else:
        listing_status = ListingStatus.ACTIVE
    
    listing = Listing(
        title=listing_data.title,
        description=listing_data.description,
        price=listing_data.price,
        currency=listing_data.currency,
        condition=ListingCondition(listing_data.condition),
        category_id=listing_data.category_id,
        author_id=current_user.id,
        status=listing_status,
        location=listing_data.location,
        published_at=datetime.utcnow() if listing_status == ListingStatus.ACTIVE else None,
    )
    
    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    
    return ListingResponse(
        id=str(listing.id),
        title=listing.title,
        description=listing.description,
        price=float(listing.price),
        currency=listing.currency,
        condition=get_condition_label(listing.condition.value),
        category=category.name,
        category_id=listing.category_id,
        location=listing.location,
        imageUrl=None,
        status=listing.status.value,
        viewsCount=0,
        createdAt=listing.created_at.isoformat() if listing.created_at else "",
        seller={"id": str(current_user.id), "firstName": current_user.first_name},
    )
