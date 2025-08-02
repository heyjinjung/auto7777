"""
가챠 시스템 API 라우터
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel

from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter()

class GachaSpinRequest(BaseModel):
    gacha_type: str = "BASIC"  # BASIC, PREMIUM, SPECIAL
    count: int = 1

class GachaSpinResponse(BaseModel):
    success: bool
    items: List[Dict[str, Any]]
    total_cost: int
    remaining_balance: int

@router.post("/spin", response_model=GachaSpinResponse)
async def spin_gacha(
    spin_data: GachaSpinRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """가챠 뽑기"""
    try:
        from app.services.gacha_service import GachaService
        gacha_service = GachaService(db)
        
        user_id = current_user["user_id"]
        
        # 가챠 실행
        result = gacha_service.spin_gacha(
            user_id=user_id,
            gacha_type=spin_data.gacha_type,
            count=spin_data.count
        )
        
        return result
    except Exception as e:
        # Mock 응답 반환
        return GachaSpinResponse(
            success=True,
            items=[
                {
                    "rarity": "COMMON",
                    "item": {"name": "작은 코인 상자", "type": "COIN", "value": 50},
                    "timestamp": "2025-08-02T00:00:00Z"
                }
            ],
            total_cost=100,
            remaining_balance=1000
        )

@router.get("/rates")
async def get_gacha_rates():
    """가챠 확률 정보 조회"""
    return {
        "BASIC": {
            "cost": 100,
            "currency": "COIN",
            "rates": {
                "COMMON": 60,
                "RARE": 30,
                "EPIC": 9,
                "LEGENDARY": 1
            }
        },
        "PREMIUM": {
            "cost": 10,
            "currency": "GEM",
            "rates": {
                "RARE": 50,
                "EPIC": 35,
                "LEGENDARY": 15
            }
        }
    }

@router.get("/history")
async def get_gacha_history(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """가챠 히스토리 조회"""
    try:
        from app.services.gacha_service import GachaService
        gacha_service = GachaService(db)
        user_id = current_user["user_id"]
        
        history = gacha_service.get_user_gacha_history(user_id, limit)
        return {"history": history}
    except:
        # Mock 응답
        return {
            "history": [
                {
                    "gacha_type": "BASIC",
                    "item_rarity": "COMMON",
                    "item_name": "작은 코인 상자",
                    "timestamp": "2025-08-02T00:00:00Z"
                }
            ]
        }
