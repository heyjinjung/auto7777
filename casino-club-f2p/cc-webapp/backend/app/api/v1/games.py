from fastapi import APIRouter, HTTPException
from typing import List
from app.models.game import Game
from app.schemas.game import GameCreate, GameResponse
from app.services.game_service import GameService

router = APIRouter()
game_service = GameService()

@router.post("/", response_model=GameResponse)
async def create_game(game: GameCreate):
    try:
        return await game_service.create_game(game)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[GameResponse])
async def get_games():
    try:
        return await game_service.get_all_games()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{game_id}", response_model=GameResponse)
async def get_game(game_id: int):
    try:
        game = await game_service.get_game_by_id(game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        return game
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))