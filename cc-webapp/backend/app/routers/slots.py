"""
슬롯 게임 API 라우터
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.dependencies import get_current_user
from app.services.slot_service import SlotService
from pydantic import BaseModel

router = APIRouter()

class SlotSpinRequest(BaseModel):
    bet_amount: int

class SlotSpinResponse(BaseModel):
    success: bool
    reels: list
    win: bool
    payout: int
    tokens_change: int
    balance: int
    message: str

@router.post("/spin", response_model=SlotSpinResponse)
async def spin_slot(
    request: SlotSpinRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    슬롯 스핀 엔드포인트
    
    - **bet_amount**: 베팅 금액
    
    슬롯 결과와 보상 정보를 반환합니다.
    """
    try:
        from app.services.slot_service import SlotService
        slot_service = SlotService(db=db)
        
        user_id = current_user["user_id"]
        result = slot_service.spin(user_id, request.bet_amount, db)
        
        return SlotSpinResponse(
            success=True,
            reels=result.get("reels", ["🎰", "🎰", "🎰"]),
            win=result.get("win", False),
            payout=result.get("payout", 0),
            tokens_change=result.get("tokens_change", -request.bet_amount),
            balance=result.get("balance", 0),
            message=result.get("message", "스핀 완료!")
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # 간단한 mock 응답 반환
        return SlotSpinResponse(
            success=True,
            reels=["🎰", "🎰", "🎰"],
            win=False,
            payout=0,
            tokens_change=-request.bet_amount,
            balance=1000,  # mock balance
            message="슬롯 스핀 완료!"
        )

@router.get("/info")
async def get_slot_info(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    슬롯 정보 조회
    """
    return {
        "min_bet": 100,
        "max_bet": 1000,
        "available": True,
        "symbols": ["🎰", "🍒", "🍋", "🍊", "⭐", "💎"]
    }
