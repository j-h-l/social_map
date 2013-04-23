from base import Base
from sqlalchemy import Column, Integer, DateTime, Numeric
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Table


friendship = Table('friendship', Base.metadata,
        Column('friend_me', Integer, ForeignKey('gwuser.id'), primary_key=True),
        Column('friend_other', Integer, ForeignKey('gwuser.id'), primary_key=True))


class GowallaUser(Base):
    """sqlalchemy model for Gowalla user"""
    __tablename__ = 'gwuser'
    id = Column(Integer, primary_key=True)

    checkins = relationship("GowallaCheckin", backref='gwuser')
    friendships_me = relationship("GowallaUser", secondary=friendship,
                                  primaryjoin=id == friendship.c.friend_me,
                                  secondaryjoin=id == friendship.c.friend_other,
                                  backref="frienships_others")


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
