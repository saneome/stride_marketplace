from datetime import datetime, timedelta
from typing import Any
from uuid import UUID
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import redis.asyncio as redis

from app.config import settings
from app.database import get_db
from app.models.user import User

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_redis_client():
    """Get Redis client"""
    return redis.from_url(settings.REDIS_URL, decode_responses=True)


async def is_token_blacklisted(token: str) -> bool:
    """Check if token is in blacklist"""
    try:
        redis_client = await get_redis_client()
        blacklisted = await redis_client.get(f"blacklist:{token}")
        return blacklisted is not None
    except Exception:
        # If Redis is unavailable, assume token is not blacklisted
        return False


async def get_current_user(
    token: str,
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current user from JWT token"""
    import structlog
    logger = structlog.get_logger()
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.info("Validating token", token_length=len(token), token_prefix=token[:20] + "..." if token else None)
    
    # Check if token is blacklisted
    blacklisted = await is_token_blacklisted(token)
    if blacklisted:
        logger.warning("Token is blacklisted", token_prefix=token[:20] + "..." if token else None)
        raise credentials_exception
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            logger.error("Token payload missing 'sub' field")
            raise credentials_exception
        logger.info("Token decoded successfully", user_id=user_id)
    except JWTError as e:
        # Log the JWT error for debugging
        logger.error("JWT decode error", error=str(e), token=token[:20] + "..." if token else None)
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user
