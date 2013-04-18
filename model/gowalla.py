from base import Base
from sqlalchemy import Column, Integer, DateTime, Numeric
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class GowallaUser(Base):
    """sqlalchemy model for Gowalla user"""
    __tablename__ = 'gwuser'
    id = Column(Integer, primary_key=True)
    checkins = relationship("GowallaCheckin", backref='gwuser')


class GowallaCheckin(Base):
    """ sqlalchemy model for Gowalla user checkins
        belongs to user
    """
    __tablename__ = 'gwcheckins'
    id = Column(Integer, primary_key=True)
    lat = Column(Numeric(precision=9, scale=6), nullable=False)
    lng = Column(Numeric(precision=9, scale=6), nullable=False)
    checkin_time = Column(DateTime, nullable=False)
    user_id = Column(Integer, ForeignKey('gwuser.id'))
