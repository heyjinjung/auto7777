"""Initial schema with basic tables

Revision ID: 20250801_000000
Revises: 
Create Date: 2025-08-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20250801_000000'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nickname', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=100), nullable=True),
        sa.Column('password_hash', sa.String(length=255), nullable=True),
        sa.Column('invite_code_used', sa.String(length=20), nullable=True),
        sa.Column('cyber_tokens', sa.Integer(), nullable=True, default=200),
        sa.Column('total_spent', sa.Integer(), nullable=True, default=0),
        sa.Column('total_earned', sa.Integer(), nullable=True, default=0),
        sa.Column('level', sa.Integer(), nullable=True, default=1),
        sa.Column('experience_points', sa.Integer(), nullable=True, default=0),
        sa.Column('avatar_url', sa.String(length=255), nullable=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('login_streak', sa.Integer(), nullable=True, default=0),
        sa.Column('is_admin', sa.Boolean(), nullable=True, default=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('nickname'),
        sa.UniqueConstraint('email')
    )

    # Create invite_codes table
    op.create_table('invite_codes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(length=20), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('max_uses', sa.Integer(), nullable=True, default=1),
        sa.Column('current_uses', sa.Integer(), nullable=True, default=0),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    # Create user_sessions table
    op.create_table('user_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('session_token', sa.String(length=255), nullable=False),
        sa.Column('refresh_token', sa.String(length=255), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('last_accessed', sa.DateTime(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('session_token')
    )

    # Create game_results table
    op.create_table('game_results',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('game_type', sa.String(length=50), nullable=False),
        sa.Column('bet_amount', sa.Integer(), nullable=False),
        sa.Column('result', sa.String(length=20), nullable=False),
        sa.Column('prize_amount', sa.Integer(), nullable=True, default=0),
        sa.Column('multiplier', sa.Float(), nullable=True, default=0.0),
        sa.Column('game_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create rewards table
    op.create_table('rewards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('reward_type', sa.String(length=50), nullable=False),
        sa.Column('reward_value', sa.Integer(), nullable=False),
        sa.Column('source', sa.String(length=100), nullable=True),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('claimed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create daily_bonuses table
    op.create_table('daily_bonuses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('claimed_date', sa.Date(), nullable=False),
        sa.Column('bonus_amount', sa.Integer(), nullable=False),
        sa.Column('streak_day', sa.Integer(), nullable=True, default=1),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'claimed_date', name='unique_user_date')
    )

    # Create battle_pass table
    op.create_table('battle_pass',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('season', sa.String(length=50), nullable=False),
        sa.Column('tier', sa.Integer(), nullable=True, default=1),
        sa.Column('experience', sa.Integer(), nullable=True, default=0),
        sa.Column('is_premium', sa.Boolean(), nullable=True, default=False),
        sa.Column('rewards_claimed', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'season', name='unique_user_season')
    )

    # Create shop_items table
    op.create_table('shop_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False),
        sa.Column('currency_type', sa.String(length=20), nullable=True, default='tokens'),
        sa.Column('image_url', sa.String(length=255), nullable=True),
        sa.Column('is_available', sa.Boolean(), nullable=True, default=True),
        sa.Column('stock_quantity', sa.Integer(), nullable=True),
        sa.Column('purchase_limit', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create user_purchases table
    op.create_table('user_purchases',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('item_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=True, default=1),
        sa.Column('price_paid', sa.Integer(), nullable=False),
        sa.Column('currency_used', sa.String(length=20), nullable=False),
        sa.Column('purchased_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['item_id'], ['shop_items.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('user_purchases')
    op.drop_table('shop_items')
    op.drop_table('battle_pass')
    op.drop_table('daily_bonuses')
    op.drop_table('rewards')
    op.drop_table('game_results')
    op.drop_table('user_sessions')
    op.drop_table('invite_codes')
    op.drop_table('users')
