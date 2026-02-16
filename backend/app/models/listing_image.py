from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_cover = Column(Boolean, default=False, nullable=False)

    # Relationships
    listing = relationship("Listing", back_populates="images")
