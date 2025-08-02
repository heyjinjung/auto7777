from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(Integer)
    vip_tier = Column(Integer, default=0)
    battlepass_level = Column(Integer, default=0)
    total_spent = Column(Integer, default=0)

    user_segments = relationship("UserSegment", back_populates="user")

class UserSegment(Base):
    __tablename__ = 'user_segments'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    rfm_group = Column(String)
    ltv_score = Column(Integer)
    risk_profile = Column(String)
    last_updated = Column(Integer)

    user = relationship("User", back_populates="user_segments")

class Game(Base):
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    popularity = Column(Integer)

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    amount = Column(Integer)
    created_at = Column(Integer)