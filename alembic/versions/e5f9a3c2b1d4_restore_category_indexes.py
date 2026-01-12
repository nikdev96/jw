"""restore_category_indexes

Revision ID: e5f9a3c2b1d4
Revises: bd3624983376
Create Date: 2026-01-12 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5f9a3c2b1d4'
down_revision: Union[str, None] = 'bd3624983376'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Restore indexes that were removed in bd3624983376
    op.create_index(
        'idx_categories_active_info',
        'categories',
        ['is_active', 'is_info_only'],
        unique=False
    )
    op.create_index(
        'idx_categories_parent_id',
        'categories',
        ['parent_id'],
        unique=False
    )


def downgrade() -> None:
    op.drop_index('idx_categories_parent_id', table_name='categories')
    op.drop_index('idx_categories_active_info', table_name='categories')
