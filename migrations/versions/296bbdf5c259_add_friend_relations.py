"""add friend relationships

Revision ID: 296bbdf5c259
Revises: None
Create Date: 2013-04-19 13:01:19.972686

"""

# revision identifiers, used by Alembic.
revision = '296bbdf5c259'
down_revision = None

from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from model.base import Base


def upgrade():
    # add friendship table - association table
    op.create_table(
            'friendship',
            sa.Column('friend_me', sa.Integer, sa.ForeignKey('gwuser.id'), primary_key=True),
            sa.Column('friend_other', sa.Integer, sa.ForeignKey('gwuser.id'), primary_key=True)
            )
    # add friends relationship() to 



def downgrade():
    op.drop_table('friendship')
