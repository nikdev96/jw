"""Add category hierarchy and flags

Revision ID: 7f8a2c9d1e5b
Revises: 4c4a1b71fec8
Create Date: 2025-12-23 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7f8a2c9d1e5b'
down_revision: Union[str, None] = '4c4a1b71fec8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns
    op.add_column('categories', sa.Column('parent_id', sa.Integer(), nullable=True))
    op.add_column('categories', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'))
    op.add_column('categories', sa.Column('is_info_only', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('categories', sa.Column('coming_soon', sa.Boolean(), nullable=False, server_default='false'))

    # Create foreign key constraint (RESTRICT for safety)
    op.create_foreign_key(
        'fk_categories_parent_id',
        'categories', 'categories',
        ['parent_id'], ['id'],
        ondelete='RESTRICT'
    )

    # Create indexes
    op.create_index('idx_categories_parent_id', 'categories', ['parent_id'], unique=False)
    op.create_index('idx_categories_active_info', 'categories', ['is_active', 'is_info_only'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_categories_active_info', table_name='categories')
    op.drop_index('idx_categories_parent_id', table_name='categories')

    # Drop foreign key
    op.drop_constraint('fk_categories_parent_id', 'categories', type_='foreignkey')

    # Drop columns
    op.drop_column('categories', 'coming_soon')
    op.drop_column('categories', 'is_info_only')
    op.drop_column('categories', 'is_active')
    op.drop_column('categories', 'parent_id')
