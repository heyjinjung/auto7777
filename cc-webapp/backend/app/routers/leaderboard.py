from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from enum import Enum

from app.database import get_db

router = APIRouter()

class LeaderboardType(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    ALL_TIME = "all_time"

@router.get("/{leaderboard_type}")
async def get_leaderboard(
    leaderboard_type: LeaderboardType,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """리더보드 조회"""
    # TODO: 실제 구현 필요
    # 임시 데이터 반환
    return {
        "type": leaderboard_type,
        "updated_at": "2025-01-01T00:00:00Z",
        "entries": [
            {
                "rank": 1,
                "user_id": 1,
                "nickname": "Player1",
                "score": 10000,
                "tier": "DIAMOND"
            },
            {
                "rank": 2,
                "user_id": 2,
                "nickname": "Player2",
                "score": 8000,
                "tier": "PLATINUM"
            }
        ]
    }

@router.get("/user/{user_id}")
async def get_user_rank(
    user_id: int,
    db: Session = Depends(get_db)
):
    """특정 사용자의 순위 조회"""
    # TODO: 실제 구현 필요
    return {
        "user_id": user_id,
        "daily_rank": 42,
        "weekly_rank": 35,
        "monthly_rank": 28,
        "all_time_rank": 156
    }