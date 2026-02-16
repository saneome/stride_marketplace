from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import structlog
import uuid
from sqlalchemy import text

from app.config import get_settings
from app.database import engine, Base
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.audit import AuditMiddleware

settings = get_settings()

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting application")
    # Create pg_trgm extension for full-text search
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm"))
    # Create tables (in production, use Alembic migrations)
    if settings.DEBUG:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    logger.info("Shutting down application")


# Create FastAPI app
app = FastAPI(
    title="Marketplace API",
    description="API for marketplace platform",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware
app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuditMiddleware)


# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    # Bind request_id to logger
    logger = structlog.get_logger()
    logger = logger.bind(request_id=request_id)
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(
        "Unhandled exception",
        path=request.url.path,
        method=request.method,
        exc_info=exc,
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "Internal server error" if not settings.DEBUG else str(exc),
            }
        },
    )


# Health check endpoint
@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


# Include routers
from app.api.public import router as public_router
from app.api.admin import listings as admin_listings, users as admin_users, categories as admin_categories, audit, stats

app.include_router(public_router, prefix="/api/v1", tags=["public"])

app.include_router(admin_listings.router, prefix="/admin/api/v1/listings", tags=["admin-listings"])
app.include_router(admin_users.router, prefix="/admin/api/v1/users", tags=["admin-users"])
app.include_router(admin_categories.router, prefix="/admin/api/v1/categories", tags=["admin-categories"])
app.include_router(audit.router, prefix="/admin/api/v1/audit", tags=["admin-audit"])
app.include_router(stats.router, prefix="/admin/api/v1/stats", tags=["admin-stats"])
