"""empty message

Revision ID: dd5a304c020a
Revises: 16b2bd500175
Create Date: 2025-09-05 12:51:44.425729

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd5a304c020a'
down_revision: Union[str, Sequence[str], None] = '16b2bd500175'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
