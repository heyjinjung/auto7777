from pydantic import BaseModel
from typing import List, Optional

class UserResponse(BaseModel):
    id: int
    nickname: str
    email: str
    vip_tier: Optional[str]
    battlepass_level: int
    total_spent: float

class GameResponse(BaseModel):
    id: int
    name: str
    thumbnail_url: str
    popularity: int

class ActionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class UserProfileResponse(BaseModel):
    user: UserResponse
    games: List[GameResponse]

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    start_date: str
    end_date: str
    image_url: Optional[str] = None

class CommunityHubResponse(BaseModel):
    events: List[EventResponse]