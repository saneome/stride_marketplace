from fastapi import APIRouter, Depends, HTTPException, status, Security, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import structlog

from app.database import get_db
from app.models.user import User
from app.security import get_current_user
from app.security import verify_password, get_password_hash
from app.utils.upload import MinIOClient
from app.utils.resize import create_thumbnail, validate_image_type

router = APIRouter()
security = HTTPBearer()


async def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current user from bearer token"""
    import structlog
    logger = structlog.get_logger()
    
    if not credentials:
        logger.error("No credentials provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authentication token provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    logger.info("Authenticating user", token_length=len(token), token_prefix=token[:20] + "..." if token else None)
    
    return await get_current_user(token, db)


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str


@router.get("/me")
async def get_current_user_profile(
    current_user: User = Depends(get_current_user_from_token)
):
    """Get current user profile"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "firstName": current_user.display_name,
        "lastName": None,
        "phone": current_user.phone,
        "location": None,
        "avatarUrl": current_user.avatar_url,
        "role": current_user.role.value,
        "isActive": current_user.is_active,
        "createdAt": current_user.created_at.isoformat(),
    }


@router.patch("/me")
async def update_current_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user_from_token),
    db: AsyncSession = Depends(get_db)
):
    """Update current user profile"""
    # Validate email if provided
    if update_data.email is not None:
        if update_data.email == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Email cannot be empty"
            )
        # Simple email validation
        if "@" not in update_data.email:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid email format"
            )
    
    # Check if email is being changed and if it's already taken
    if update_data.email and update_data.email != current_user.email:
        result = await db.execute(
            select(User).where(User.email == update_data.email)
        )
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
        current_user.email = update_data.email
    
    if update_data.first_name:
        current_user.display_name = update_data.first_name
    
    if update_data.phone is not None:
        current_user.phone = update_data.phone if update_data.phone != "" else None
    
    await db.commit()
    await db.refresh(current_user)
    
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "firstName": current_user.display_name,
        "lastName": None,
        "phone": current_user.phone,
        "location": None,
        "avatarUrl": current_user.avatar_url,
        "role": current_user.role.value,
        "isActive": current_user.is_active,
        "createdAt": current_user.created_at.isoformat(),
    }


@router.post("/me/password")
async def update_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_user_from_token),
    db: AsyncSession = Depends(get_db)
):
    """Update user password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    
    await db.commit()
    
    return {"message": "Password updated successfully"}


MAX_AVATAR_SIZE = 5 * 1024 * 1024  # 5 MB

logger = structlog.get_logger()


@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_from_token),
    db: AsyncSession = Depends(get_db),
):
    """Upload or replace user avatar."""
    if not validate_image_type(file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимый тип файла. Разрешены: JPEG, PNG, WebP",
        )

    file_data = await file.read()
    if len(file_data) > MAX_AVATAR_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Файл превышает 5 МБ",
        )

    # Resize to 300x300 WEBP
    avatar_data = create_thumbnail(file_data, (300, 300))

    minio_client = MinIOClient()
    object_name = f"avatars/{minio_client.generate_object_name(file.filename or 'avatar.jpg')}"
    # Ensure .webp extension since we convert
    object_name = object_name.rsplit(".", 1)[0] + ".webp"
    avatar_url = await minio_client.upload_file(avatar_data, object_name, "image/webp")

    # Delete old avatar if exists
    if current_user.avatar_url:
        old_object = current_user.avatar_url.removeprefix("/uploads/")
        try:
            await minio_client.delete_file(old_object)
        except Exception:
            logger.warning("Failed to delete old avatar", old_url=current_user.avatar_url)

    current_user.avatar_url = avatar_url
    await db.commit()
    await db.refresh(current_user)

    return {"avatarUrl": current_user.avatar_url}


@router.get("/{user_id}/listings")
async def get_user_listings(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get public listings for a user"""
    # TODO: Implement user listings endpoint
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Not implemented yet"
    )


@router.get("/{user_id}")
async def get_user_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get public user profile"""
    # TODO: Implement public user profile endpoint
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Not implemented yet"
    )
