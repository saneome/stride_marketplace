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
from app.security.password import hash_password
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
        # Electronics
        {"name": "Электроника", "slug": "electronics", "parent_id": None, "sort_order": 1},
        {"name": "Смартфоны", "slug": "smartphones", "parent_id": None, "sort_order": 2},
        {"name": "Ноутбуки", "slug": "laptops", "parent_id": None, "sort_order": 3},
        {"name": "Планшеты", "slug": "tablets", "parent_id": None, "sort_order": 4},
        {"name": "Аудиотехника", "slug": "audio", "parent_id": None, "sort_order": 5},
        {"name": "Фото и видео", "slug": "photo-video", "parent_id": None, "sort_order": 6},
        
        # Sports
        {"name": "Спорт и отдых", "slug": "sports", "parent_id": None, "sort_order": 10},
        {"name": "Велосипеды", "slug": "bicycles", "parent_id": None, "sort_order": 11},
        {"name": "Самокаты", "slug": "scooters", "parent_id": None, "sort_order": 12},
        {"name": "Электросамокаты", "slug": "electric-scooters", "parent_id": None, "sort_order": 13},
        {"name": "Ватрушки и матрасы", "slug": "inflatables", "parent_id": None, "sort_order": 14},
        {"name": "Зимний спорт", "slug": "winter-sports", "parent_id": None, "sort_order": 15},
        {"name": "Летний спорт", "slug": "summer-sports", "parent_id": None, "sort_order": 16},
        
        # Home
        {"name": "Для дома", "slug": "home", "parent_id": None, "sort_order": 20},
        {"name": "Мебель", "slug": "furniture", "parent_id": None, "sort_order": 21},
        {"name": "Бытовая техника", "slug": "appliances", "parent_id": None, "sort_order": 22},
        {"name": "Посуда", "slug": "cookware", "parent_id": None, "sort_order": 23},
        
        # Clothing
        {"name": "Одежда и обувь", "slug": "clothing", "parent_id": None, "sort_order": 30},
        {"name": "Мужская одежда", "slug": "mens-clothing", "parent_id": None, "sort_order": 31},
        {"name": "Женская одежда", "slug": "womens-clothing", "parent_id": None, "sort_order": 32},
        {"name": "Детская одежда", "slug": "kids-clothing", "parent_id": None, "sort_order": 33},
        {"name": "Обувь", "slug": "shoes", "parent_id": None, "sort_order": 34},
        
        # Auto
        {"name": "Авто и мото", "slug": "auto", "parent_id": None, "sort_order": 40},
        {"name": "Запчасти", "slug": "auto-parts", "parent_id": None, "sort_order": 41},
        {"name": "Аксессуары", "slug": "auto-accessories", "parent_id": None, "sort_order": 42},
        
        # Other
        {"name": "Хобби и творчество", "slug": "hobbies", "parent_id": None, "sort_order": 50},
        {"name": "Книги", "slug": "books", "parent_id": None, "sort_order": 51},
        {"name": "Музыкальные инструменты", "slug": "musical-instruments", "parent_id": None, "sort_order": 52},
        {"name": "Коллекционирование", "slug": "collecting", "parent_id": None, "sort_order": 53},
        {"name": "Другое", "slug": "other", "parent_id": None, "sort_order": 99},
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
