"""
룰렛 게임 API 라우터
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.dependencies import get_current_user
from app.services.roulette_service import RouletteService, RouletteSpinResult
from pydantic import BaseModel

router = APIRouter()

class RouletteSpinRequest(BaseModel):
    bet_amount: int

class RouletteSpinResponse(BaseModel):
    success: bool
    prize_name: str
    prize_value: int
    tokens_change: int
    balance: int
    message: str
    daily_spin_count: int

@router.post("/spin", response_model=RouletteSpinResponse)
async def spin_roulette(
    request: RouletteSpinRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    룰렛 스핀 엔드포인트
    
    - **bet_amount**: 베팅 금액 (5000-10000)
    
    룰렛 결과와 보상 정보를 반환합니다.
    """
    roulette_service = RouletteService(db=db)
    
    user_id = current_user["user_id"]
    
    try:
        result = roulette_service.spin(user_id, request.bet_amount, db)
        
        return RouletteSpinResponse(
            success=result.success,
            prize_name=result.prize.name if result.prize else "없음",
            prize_value=result.prize.value if result.prize else 0,
            tokens_change=result.tokens_change,
            balance=result.balance,
            message=result.message,
            daily_spin_count=result.daily_spin_count
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="룰렛 스핀 중 오류가 발생했습니다."
        )

@router.get("/info")
async def get_roulette_info(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    룰렛 정보 조회
    """
    # 간단한 정보 반환
    return {
        "max_daily_spins": 10,
        "min_bet": 5000,
        "max_bet": 10000,
        "available": True
    }
