"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2026-02-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = '000'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('first_name', sa.String(), nullable=True),
        sa.Column('last_name', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    
    # Categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('slug', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('parent_id', sa.UUID(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['categories.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_categories_slug', 'categories', ['slug'], unique=True)
    
    # Listings table
    op.create_table(
        'listings',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('currency', sa.String(), nullable=False, server_default='RUB'),
        sa.Column('category_id', sa.UUID(), nullable=False),
        sa.Column('seller_id', sa.UUID(), nullable=False),
        sa.Column('condition', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_sold', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('views_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
        sa.ForeignKeyConstraint(['seller_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_listings_category_id', 'listings', ['category_id'])
    op.create_index('ix_listings_seller_id', 'listings', ['seller_id'])
    op.create_index('ix_listings_search', 'listings', ['title', 'description'], postgresql_using='gin', postgresql_ops={'title': 'gin_trgm_ops', 'description': 'gin_trgm_ops'})
    
    # Images table
    op.create_table(
        'images',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('listing_id', sa.UUID(), nullable=False),
        sa.Column('url', sa.String(), nullable=False),
        sa.Column('thumbnail_url', sa.String(), nullable=True),
        sa.Column('alt_text', sa.String(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_images_listing_id', 'images', ['listing_id'])
    
    # Messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('listing_id', sa.UUID(), nullable=False),
        sa.Column('sender_id', sa.UUID(), nullable=False),
        sa.Column('receiver_id', sa.UUID(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_messages_listing_id', 'messages', ['listing_id'])
    op.create_index('ix_messages_receiver_id', 'messages', ['receiver_id'])
    op.create_index('ix_messages_sender_id', 'messages', ['sender_id'])
    
    # Favorites table
    op.create_table(
        'favorites',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('listing_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_favorites_listing_id', 'favorites', ['listing_id'])
    op.create_index('ix_favorites_user_id', 'favorites', ['user_id'])
    op.create_index('ix_favorites_user_listing', 'favorites', ['user_id', 'listing_id'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_favorites_user_listing', table_name='favorites')
    op.drop_index('ix_favorites_user_id', table_name='favorites')
    op.drop_index('ix_favorites_listing_id', table_name='favorites')
    op.drop_table('favorites')
    
    op.drop_index('ix_messages_sender_id', table_name='messages')
    op.drop_index('ix_messages_receiver_id', table_name='messages')
    op.drop_index('ix_messages_listing_id', table_name='messages')
    op.drop_table('messages')
    
    op.drop_index('ix_images_listing_id', table_name='images')
    op.drop_table('images')
    
    op.drop_index('ix_listings_search', table_name='listings')
    op.drop_index('ix_listings_seller_id', table_name='listings')
    op.drop_index('ix_listings_category_id', table_name='listings')
    op.drop_table('listings')
    
    op.drop_index('ix_categories_slug', table_name='categories')
    op.drop_table('categories')
    
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
    
    op.execute('DROP EXTENSION IF EXISTS pg_trgm')
