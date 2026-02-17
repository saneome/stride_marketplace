from sqlalchemy import Column, String, Text, Numeric, DateTime, Enum as SQLEnum, Index, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import text
import uuid
import enum

from app.database import Base


class ListingCondition(str, enum.Enum):
    NEW = "new"
    LIKE_NEW = "like_new"
    USED = "used"
    FOR_PARTS = "for_parts"


class ListingStatus(str, enum.Enum):
    DRAFT = "draft"
    MODERATION = "moderation"
    ACTIVE = "active"
    REJECTED = "rejected"
    SOLD = "sold"
    ARCHIVED = "archived"


class Listing(Base):
    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), default="RUB", nullable=False)
    condition = Column(String(20), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(20), default=ListingStatus.DRAFT.value, nullable=False, index=True)
    reject_reason = Column(Text, nullable=True)
    location = Column(String(100), nullable=False)
    views_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True, index=True)

    # Relationships
    author = relationship("User", back_populates="listings")
    category = relationship("Category", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan", order_by="ListingImage.sort_order")
    favorites = relationship("Favorite", back_populates="listing", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="listing", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_listings_status_published_at', 'status', 'published_at'),
        Index('ix_listings_category_status', 'category_id', 'status'),
        Index('ix_listings_author_status', 'author_id', 'status'),
        Index('ix_listings_search', 'title', 'description', postgresql_using='gin', postgresql_ops={
            'title': 'gin_trgm_ops',
            'description': 'gin_trgm_ops'
        }),
    )
