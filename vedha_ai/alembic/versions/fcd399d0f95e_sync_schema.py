"""sync_schema

Revision ID: fcd399d0f95e
Revises: 
Create Date: 2026-08-04 11:23:29.940162

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'fcd399d0f95e'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect
    bind = op.get_bind()
    insp = inspect(bind)
    
    # 1. Add onboarding_complete to users safely with default False if missing
    columns = [c['name'] for c in insp.get_columns('users')]
    if 'onboarding_complete' not in columns:
        op.add_column('users', sa.Column('onboarding_complete', sa.Boolean(), nullable=False, server_default=sa.text('false')))
        print("[MIGRATION] Added column 'onboarding_complete' to 'users' table.")
    
    # 2. Add unique constraint uq_user_skill to skills if missing
    try:
        constraints = insp.get_unique_constraints('skills')
        constraint_names = [c['name'] for c in constraints]
        if 'uq_user_skill' not in constraint_names:
            op.create_unique_constraint('uq_user_skill', 'skills', ['user_id', 'skill_name'])
            print("[MIGRATION] Added unique constraint 'uq_user_skill' to 'skills' table.")
    except Exception as e:
        print(f"[MIGRATION] Warning when checking unique constraint: {str(e)}")


def downgrade() -> None:
    from sqlalchemy import inspect
    bind = op.get_bind()
    insp = inspect(bind)
    
    columns = [c['name'] for c in insp.get_columns('users')]
    if 'onboarding_complete' in columns:
        op.drop_column('users', 'onboarding_complete')
        
    try:
        constraints = insp.get_unique_constraints('skills')
        constraint_names = [c['name'] for c in constraints]
        if 'uq_user_skill' in constraint_names:
            op.drop_constraint('uq_user_skill', 'skills', type_='unique')
    except Exception:
        pass
