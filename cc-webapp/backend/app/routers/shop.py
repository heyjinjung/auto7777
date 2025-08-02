"""
상점 API 라우터
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel

from app.database import get_db
from app.dependencies import get_current_user

# Mock 데이터로 임시 대체
try:
    from app.services.shop_service import ShopService
    SHOP_SERVICE_AVAILABLE = True
except ImportError:
    SHOP_SERVICE_AVAILABLE = False
    print("⚠️ ShopService not available, using mock data")

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

# Mock 상점 아이템 데이터
MOCK_SHOP_ITEMS = [
    {
        "id": 1,
        "name": "코인 100개",
        "description": "게임 코인 100개를 구매합니다",
        "price": 1,
        "currency": "GEM",
        "category": "currency",
        "is_available": True
    },
    {
        "id": 2,
        "name": "코인 500개",
        "description": "게임 코인 500개를 구매합니다",
        "price": 5,
        "currency": "GEM",
        "category": "currency",
        "is_available": True
    },
    {
        "id": 3,
        "name": "VIP 멤버십",
        "description": "30일 VIP 멤버십",
        "price": 50,
        "currency": "GEM",
        "category": "membership",
        "is_available": True
    }
]

@router.get("/items", response_model=List[ShopItemResponse])
async def get_shop_items(
    category: str = None,
    db: Session = Depends(get_db)
):
    """상점 아이템 목록 조회"""
    # Mock 데이터 반환 (인증 불필요)
    items = MOCK_SHOP_ITEMS
    if category:
        items = [item for item in items if item["category"] == category]
    return items

@router.post("/buy")
async def purchase_item(
    purchase: PurchaseRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """아이템 구매"""
    if SHOP_SERVICE_AVAILABLE:
        shop_service = ShopService(db)
        user_id = current_user["user_id"]
        
        result = shop_service.purchase_item(
            user_id=user_id,
            item_id=purchase.item_id,
            quantity=purchase.quantity
        )
        return result
    else:
        # Mock 구매 처리
        item = next((item for item in MOCK_SHOP_ITEMS if item["id"] == purchase.item_id), None)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {
            "success": True,
            "item_id": purchase.item_id,
            "quantity": purchase.quantity,
            "total_cost": item["price"] * purchase.quantity,
            "currency": item["currency"],
            "message": f"{item['name']} {purchase.quantity}개 구매 완료"
        }

@router.get("/history")
async def get_purchase_history(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20
):
    """구매 내역 조회"""
    if SHOP_SERVICE_AVAILABLE:
        shop_service = ShopService(db)
        user_id = current_user["user_id"]
        
        history = shop_service.get_user_purchase_history(user_id, limit)
        return {"history": history}
    else:
        # Mock 구매 내역
        return {
            "history": [
                {
                    "id": 1,
                    "item_name": "코인 100개",
                    "quantity": 1,
                    "cost": 1,
                    "currency": "GEM",
                    "purchased_at": "2025-08-02T12:00:00Z"
                }
            ]
        }

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
