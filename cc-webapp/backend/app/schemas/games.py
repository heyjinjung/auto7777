from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class GamePlayRequest(BaseModel):
    """게임 플레이 요청 스키마"""
    game_type: str  # "SLOT", "RPS", "ROULETTE"
    bet_amount: int
    user_choice: Optional[str] = None  # RPS 게임에서 필요 (ROCK, PAPER, SCISSORS)
    
    class Config:
        schema_extra = {
            "example": {
                "game_type": "SLOT",
                "bet_amount": 100,
                "user_choice": None
            }
        }

class GamePlayResponse(BaseModel):
    """게임 플레이 결과 스키마"""
    win: bool
    payout: int = 0
    game_result: Dict[str, Any]  # 게임별 결과 데이터
    message: str
    
    class Config:
        schema_extra = {
            "example": {
                "win": True,
                "payout": 200,
                "game_result": {
                    "reels": ["🍒", "🍒", "🍒"],
                    "multiplier": 2
                },
                "message": "3개의 체리를 맞추셨습니다! 2배 보상!"
            }
        }
        
class SlotResult(BaseModel):
    """슬롯 게임 결과"""
    reels: List[str]
    multiplier: float
    
class RpsResult(BaseModel):
    """가위바위보 결과"""
    user_choice: str
    system_choice: str
    
class RouletteResult(BaseModel):
    """룰렛 결과"""
    number: int
    color: str
    multiplier: float
