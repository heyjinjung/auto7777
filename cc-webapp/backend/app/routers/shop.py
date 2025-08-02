"""
상점 API 라우터
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel

from app.database import get_db
from app.dependencies import get_current_user
from app.services.shop_service import ShopService

router = APIRouter()

class PurchaseRequest(BaseModel):
    item_id: int
    quantity: int = 1

class ShopItemResponse(BaseModel):
    id: int
    name: str
    description: str
    price: int
    currency: str
    category: str
    is_available: bool

@router.get("/items", response_model=List[ShopItemResponse])
async def get_shop_items(
    category: str = None,
    db: Session = Depends(get_db)
):
    """상점 아이템 목록 조회"""
    shop_service = ShopService(db)
    items = shop_service.get_available_items(category)
    return items

@router.post("/buy")
async def purchase_item(
    purchase: PurchaseRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """아이템 구매"""
    shop_service = ShopService(db)
    user_id = current_user["user_id"]
    
    result = shop_service.purchase_item(
        user_id=user_id,
        item_id=purchase.item_id,
        quantity=purchase.quantity
    )
    
    return result

@router.get("/history")
async def get_purchase_history(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20
):
    """구매 내역 조회"""
    shop_service = ShopService(db)
    user_id = current_user["user_id"]
    
    history = shop_service.get_user_purchase_history(user_id, limit)
    return {"history": history}

@router.get("/categories")
async def get_shop_categories():
    """상점 카테고리 목록"""
    return {
        "categories": [
            {"id": "PACKAGE", "name": "패키지", "description": "알뜰한 묶음 상품"},
            {"id": "CURRENCY", "name": "화폐", "description": "코인과 젬"},
            {"id": "LOOTBOX", "name": "상자", "description": "랜덤 보상 상자"},
            {"id": "VIP", "name": "VIP", "description": "프리미엄 혜택"},
            {"id": "BOOSTER", "name": "부스터", "description": "게임 부스터"}
        ]
    }
