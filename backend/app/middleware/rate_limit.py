from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import redis.asyncio as redis
import structlog
from app.config import get_settings

settings = get_settings()
logger = structlog.get_logger()


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.redis_client = None

    async def dispatch(self, request: Request, call_next):
        # Initialize Redis client lazily
        if self.redis_client is None:
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        # Determine rate limit based on endpoint
        if request.url.path.startswith("/api/v1/auth"):
            limit = settings.RATE_LIMIT_AUTH
        else:
            limit = settings.RATE_LIMIT_GENERAL

        # Check rate limit
        key = f"rate_limit:{client_ip}:{request.url.path}"
        
        try:
            current = await self.redis_client.incr(key)
            
            if current == 1:
                await self.redis_client.expire(key, 60)  # 1 minute window
            
            if current > limit:
                logger.warning(
                    "Rate limit exceeded",
                    ip=client_ip,
                    path=request.url.path,
                    current=current,
                    limit=limit,
                )
                raise HTTPException(
                    status_code=429,
                    detail={
                        "error": {
                            "code": "RATE_LIMIT_EXCEEDED",
                            "message": "Too many requests. Please try again later.",
                        }
                    },
                )
        except Exception as e:
            logger.error("Rate limit check failed", error=str(e))
            # Continue if Redis is unavailable

        response = await call_next(request)
        return response
