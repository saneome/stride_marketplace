from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Marketplace API"
    
    # Environment
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://marketplace:marketplace123@postgres:5432/marketplace"
    
    # Redis
    REDIS_URL: str = "redis://redis:6379/0"
    
    # MinIO
    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "marketplace"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Rate limiting
    RATE_LIMIT_GENERAL: int = 100
    RATE_LIMIT_AUTH: int = 10
    
    @property
    def allowed_origins_list(self) -> list[str]:
        return self.BACKEND_CORS_ORIGINS
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
