"""
Centralized FastAPI dependencies for authentication and authorization.
"""
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.security import get_current_user

security_scheme = HTTPBearer()


async def get_current_user_dep(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get current authenticated user and store in request.state for audit middleware."""
    user = await get_current_user(credentials.credentials, db)
    request.state.user = user
    return user


def require_role(*roles: UserRole):
    """Factory: returns a dependency that checks if user has one of the specified roles."""
    async def _check_role(
        current_user: User = Depends(get_current_user_dep),
    ) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user
    return _check_role


require_admin = require_role(UserRole.ADMIN)
require_moderator = require_role(UserRole.MODERATOR, UserRole.ADMIN)
