"""Create pg_trgm extension

Revision ID: 000
Revises: 
Create Date: 2026-02-16

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '000'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create pg_trgm extension for full-text search
    # Use raw SQL to ensure it's created outside of transaction
    conn = op.get_bind()
    conn.execute('CREATE EXTENSION IF NOT EXISTS pg_trgm')


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute('DROP EXTENSION IF EXISTS pg_trgm')
