from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    parent_id = Column(String, ForeignKey("categories.id"), nullable=True, index=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Self-referential relationship for nested categories
    children = relationship(
        "Category",
        back_populates="parent",
        remote_side="Category.id"
    )
    parent = relationship("Category", back_populates="children", remote_side=[parent_id])
    
    # Relationships
    listings = relationship("Listing", back_populates="category")
