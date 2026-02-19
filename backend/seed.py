"""
Seed script for initial data.
Creates admin user and base categories.
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models import User, Category, UserRole
from app.security import get_password_hash as hash_password
from app.config import get_settings
import structlog

logger = structlog.get_logger()
settings = get_settings()


async def create_admin_user(db: AsyncSession) -> None:
    """Create admin user if not exists."""
    result = await db.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        logger.info("Admin user already exists", email=settings.ADMIN_EMAIL)
        return

    admin_user = User(
        email=settings.ADMIN_EMAIL,
        hashed_password=hash_password(settings.ADMIN_PASSWORD),
        display_name="Administrator",
        role=UserRole.ADMIN,
        is_active=True,
    )

    db.add(admin_user)
    await db.commit()
    await db.refresh(admin_user)

    logger.info("Admin user created", email=settings.ADMIN_EMAIL, user_id=str(admin_user.id))


async def create_categories(db: AsyncSession) -> None:
    """Create base categories if not exist."""
    categories_data = [
        {"name": "Велосипеды", "slug": "bikes", "parent_id": None, "sort_order": 1},
        {"name": "Самокаты", "slug": "scooters", "parent_id": None, "sort_order": 2},
        {"name": "Ватрушки", "slug": "tubes", "parent_id": None, "sort_order": 3},
        {"name": "Лыжи", "slug": "skis", "parent_id": None, "sort_order": 4},
        {"name": "Сноуборды", "slug": "snowboards", "parent_id": None, "sort_order": 5},
        {"name": "Коньки", "slug": "skates", "parent_id": None, "sort_order": 6},
        {"name": "Скейты", "slug": "skateboards", "parent_id": None, "sort_order": 7},
        {"name": "Б/у товары", "slug": "used", "parent_id": None, "sort_order": 8},
    ]

    created_count = 0
    for cat_data in categories_data:
        result = await db.execute(select(Category).where(Category.slug == cat_data["slug"]))
        existing_cat = result.scalar_one_or_none()

        if existing_cat:
            logger.debug("Category already exists", slug=cat_data["slug"])
            continue

        category = Category(**cat_data)
        db.add(category)
        created_count += 1

    await db.commit()
    logger.info("Categories created", count=created_count)


async def main():
    """Main seed function."""
    logger.info("Starting seed script")

    async with AsyncSessionLocal() as db:
        try:
            await create_admin_user(db)
            await create_categories(db)
            logger.info("Seed script completed successfully")
        except Exception as e:
            logger.error("Seed script failed", error=str(e))
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(main())
