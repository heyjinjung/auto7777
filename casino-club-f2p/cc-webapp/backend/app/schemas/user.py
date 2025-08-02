from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    nickname: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: str
    vip_tier: Optional[str] = None
    battlepass_level: Optional[int] = 0
    total_spent: Optional[float] = 0.0

    class Config:
        orm_mode = True

class UserProfile(User):
    points: int
    segment: Optional[str] = None
    risk_profile: Optional[str] = None