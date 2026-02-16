from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response."""
    data: list[T]
    meta: "PaginationMeta"


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    page: int = Field(..., ge=1)
    per_page: int = Field(..., ge=1, le=100)
    total: int = Field(..., ge=0)
    total_pages: int = Field(..., ge=0)


class ErrorResponse(BaseModel):
    """Error response."""
    error: "ErrorDetail"


class ErrorDetail(BaseModel):
    """Error detail."""
    code: str
    message: str
    details: Optional[list["ValidationError"]] = None


class ValidationError(BaseModel):
    """Validation error detail."""
    field: str
    message: str
