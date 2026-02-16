from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models.audit_log import AuditLog
from app.models.user import User
import structlog
import json

logger = structlog.get_logger()


class AuditMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        # Only audit admin API requests
        if not request.url.path.startswith("/admin/api/"):
            return await call_next(request)

        # Get user from request state (set by auth dependency)
        user: User = getattr(request.state, "user", None)
        
        if not user:
            return await call_next(request)

        # Get original response
        response = await call_next(request)

        # Audit mutating operations
        if request.method in ["POST", "PATCH", "PUT", "DELETE"]:
            await self._log_audit(request, response, user)

        return response

    async def _log_audit(self, request: Request, response: Response, user: User):
        try:
            async with AsyncSessionLocal() as db:
                # Extract entity info from path
                path_parts = request.url.path.strip("/").split("/")
                entity_type = path_parts[-2] if len(path_parts) >= 2 else "unknown"
                entity_id = path_parts[-1] if len(path_parts) >= 3 else None

                # Determine action
                action = f"{request.method.lower()}.{entity_type}"

                # Create audit log entry
                audit_log = AuditLog(
                    user_id=user.id,
                    action=action,
                    entity_type=entity_type,
                    entity_id=entity_id or "",
                    ip_address=request.client.host if request.client else None,
                )

                db.add(audit_log)
                await db.commit()

                logger.info(
                    "Audit log created",
                    user_id=str(user.id),
                    action=action,
                    entity_type=entity_type,
                    entity_id=entity_id,
                )
        except Exception as e:
            logger.error("Failed to create audit log", error=str(e))
