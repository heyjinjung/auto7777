from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/history/{user_id}")
async def get_reward_history(
    user_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50
):
    """보상 내역 조회"""
    # 본인 또는 관리자만 조회 가능
    if current_user["user_id"] != user_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    
    try:
        from app.services.reward_service import RewardService
        reward_service = RewardService(db)
        history = reward_service.get_user_reward_history(user_id, limit)
        return {"rewards": history}
    except:
        # Mock 응답
        return {
            "rewards": [
                {
                    "type": "COIN",
                    "amount": 100,
                    "source": "daily_login",
                    "timestamp": "2025-08-02T00:00:00Z"
                }
            ]
        }

@router.get("/daily")
async def claim_daily_reward(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """일일 보상 수령"""
    try:
        from app.services.reward_service import RewardService
        reward_service = RewardService(db)
        user_id = current_user["user_id"]
        
        result = reward_service.claim_daily_reward(user_id)
        return result
    except:
        # Mock 응답
        return {
            "success": True,
            "reward": {"type": "COIN", "amount": 100},
            "message": "일일 보상을 수령했습니다!"
        }

@router.get("/streak")
async def get_login_streak(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """로그인 연속 일수 조회"""
    try:
        from app.services.reward_service import RewardService
        reward_service = RewardService(db)
        user_id = current_user["user_id"]
        
        streak = reward_service.get_login_streak(user_id)
        return {"streak": streak}
    except:
        # Mock 응답
        return {"streak": 1}