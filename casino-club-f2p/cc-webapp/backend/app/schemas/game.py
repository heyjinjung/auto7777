from pydantic import BaseModel
from typing import List, Optional

class GameBase(BaseModel):
    name: str
    description: str
    image_url: str
    popularity: int

class GameCreate(GameBase):
    pass

class GameUpdate(GameBase):
    pass

class Game(GameBase):
    id: int

    class Config:
        orm_mode = True

class GameListResponse(BaseModel):
    games: List[Game]