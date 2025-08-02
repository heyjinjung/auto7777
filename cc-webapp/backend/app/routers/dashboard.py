from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db

# Mock 대시보드 서비스 (실제 서비스가 없으므로)
try:
    from app.services.dashboard_service import DashboardService
    DASHBOARD_SERVICE_AVAILABLE = True
except ImportError:
    DASHBOARD_SERVICE_AVAILABLE = False
    print("⚠️ DashboardService not available, using mock data")

router = APIRouter(
    tags=["Dashboard"], # 대문자로 변경하여 중복 태그 해결
)

@router.get("/main")
def get_main_dashboard():
    """
    Get main dashboard statistics.
    """
    # Mock 대시보드 데이터 (DB 없이)
    return {
        "total_users": 1234,
        "active_users": 567,
        "total_games_played": 9876,
        "total_revenue": 5432.10,
        "popular_games": [
            {"name": "슬롯머신", "plays": 3456},
            {"name": "가챠", "plays": 2345},
            {"name": "룰렛", "plays": 1234}
        ]
    }

@router.get("/games")
def get_games_dashboard():
    """
    Get game-specific dashboard statistics.
    """
    # Mock 게임 통계 (DB 없이)
    return {
        "slot_games": {"total_spins": 5678, "total_winnings": 1234.56},
        "gacha_spins": {"total_spins": 3456, "rare_items": 123},
        "roulette_games": {"total_spins": 2345, "biggest_win": 999.99}
    }

@router.get("/social-proof")
def get_social_proof():
    """
    Get statistics for social proof widgets.
    This endpoint is not protected by admin auth to be publicly available.
    """
    # Mock 소셜 프루프 데이터 (DB 없이)
    return {
        "recent_winners": [
            {"username": "Player123", "game": "슬롯", "amount": 500},
            {"username": "Lucky777", "game": "가챠", "amount": 1000},
            {"username": "Winner999", "game": "룰렛", "amount": 750}
        ],
        "online_users": 234,
        "games_played_today": 1567
    }
