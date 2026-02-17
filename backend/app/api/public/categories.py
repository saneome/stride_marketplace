from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.category import Category
from app.models.listing import Listing, ListingStatus

router = APIRouter()


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    parentId: Optional[int] = None
    icon: Optional[str] = None
    sortOrder: int
    isActive: bool
    listingsCount: int = 0


@router.get("", response_model=list[CategoryResponse])
async def get_categories(
    db: AsyncSession = Depends(get_db),
    active_only: bool = True,
):
    """Получить список категорий"""
    query = select(Category)
    
    if active_only:
        query = query.where(Category.is_active == True)
    
    query = query.order_by(Category.sort_order, Category.name)
    
    result = await db.execute(query)
    categories = result.scalars().all()
    
    # Get listings count for each category
    response = []
    for category in categories:
        count_result = await db.execute(
            select(func.count())
            .select_from(Listing)
            .where(
                Listing.category_id == category.id,
                Listing.status == ListingStatus.ACTIVE
            )
        )
        listings_count = count_result.scalar() or 0
        
        response.append(CategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            parentId=category.parent_id,
            icon=category.icon,
            sortOrder=category.sort_order,
            isActive=category.is_active,
            listingsCount=listings_count,
        ))
    
    return response


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Получить одну категорию"""
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Get listings count
    count_result = await db.execute(
        select(func.count())
        .select_from(Listing)
        .where(
            Listing.category_id == category.id,
            Listing.status == ListingStatus.ACTIVE
        )
    )
    listings_count = count_result.scalar() or 0
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        parentId=category.parent_id,
        icon=category.icon,
        sortOrder=category.sort_order,
        isActive=category.is_active,
        listingsCount=listings_count,
    )
