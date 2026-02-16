from fastapi import APIRouter
from app.api.public import auth, listings, categories, favorites, messages, users, notifications

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(listings.router, prefix="/listings", tags=["listings"])
router.include_router(categories.router, prefix="/categories", tags=["categories"])
router.include_router(favorites.router, prefix="/favorites", tags=["favorites"])
router.include_router(messages.router, prefix="/messages", tags=["messages"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
