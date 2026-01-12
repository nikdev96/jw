"""add_thc_constraint

Revision ID: f7d8e9a1c3b5
Revises: e5f9a3c2b1d4
Create Date: 2026-01-12 15:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f7d8e9a1c3b5'
down_revision: Union[str, None] = 'e5f9a3c2b1d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add check constraint for THC range (0-100%)
    op.create_check_constraint(
        'thc_range_check',
        'products',
        'thc IS NULL OR (thc >= 0 AND thc <= 100)'
    )


def downgrade() -> None:
    op.drop_constraint('thc_range_check', 'products', type_='check')
