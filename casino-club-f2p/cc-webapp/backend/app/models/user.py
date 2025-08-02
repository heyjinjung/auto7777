from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
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
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_segments")