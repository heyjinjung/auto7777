from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel

from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter()

class BattlePassStatusResponse(BaseModel):
    season: int
    level: int
    xp: int
    xp_to_next_level: int
    is_premium: bool
    claimable_rewards: List[int]

@router.get("/status", response_model=BattlePassStatusResponse)
async def get_battlepass_status(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """배틀패스 상태 조회"""
    user_id = current_user["user_id"]
    
    # Mock 데이터
    return BattlePassStatusResponse(
        season=1,
        level=5,
        xp=250,
        xp_to_next_level=100,
        is_premium=False,
        claimable_rewards=[1, 2, 3]
    )

@router.post("/claim/{level}")
async def claim_battlepass_reward(
    level: int,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """배틀패스 보상 수령"""
    user_id = current_user["user_id"]
    
    if level < 1 or level > 100:
        raise HTTPException(status_code=400, detail="Invalid level")
    
    # Mock 보상 데이터
    rewards = {
        1: {"type": "COIN", "value": 100},
        2: {"type": "COIN", "value": 150},
        3: {"type": "GEM", "value": 5},
        4: {"type": "COIN", "value": 200},
        5: {"type": "BOOSTER", "value": 1}
    }
    
    reward = rewards.get(level, {"type": "COIN", "value": 50})
    
    return {
        "success": True,
        "level": level,
        "reward": reward,
        "message": f"레벨 {level} 보상을 수령했습니다!"
    }

@router.post("/upgrade")
async def upgrade_to_premium(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """프리미엄 배틀패스로 업그레이드"""
    user_id = current_user["user_id"]
    
    return {
        "success": True,
        "message": "프리미엄 배틀패스로 업그레이드되었습니다!",
        "premium_rewards_unlocked": True
    }

@router.get("/rewards")
async def get_battlepass_rewards(
    db: Session = Depends(get_db)
):
    """현재 시즌 배틀패스 보상 목록"""
    # Mock 보상 목록
    rewards = []
    for level in range(1, 21):
        free_reward = {"type": "COIN", "value": 50 * level}
        premium_reward = {"type": "GEM", "value": level // 2 + 1}
        
        rewards.append({
            "level": level,
            "xp_required": level * 100,
            "free_reward": free_reward,
            "premium_reward": premium_reward
        })
    
    return {"rewards": rewards}
    return {"rewards": rewards}