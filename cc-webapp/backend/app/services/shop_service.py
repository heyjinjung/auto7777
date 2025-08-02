from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone

from app import models
from app.services.user_service import UserService

class ShopService:
    """상점 서비스"""
    
    def __init__(self, db: Session):
        self.db = db
        self.user_service = UserService(db)
    
    def get_available_items(self, category: str = None) -> List[Dict[str, Any]]:
        """판매 중인 아이템 목록 조회"""
        query = self.db.query(models.ShopItem).filter(models.ShopItem.is_available == True)
        
        if category:
            query = query.filter(models.ShopItem.category == category)
        
        items = query.all()
        
        return [
            {
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "price": item.price,
                "currency": item.currency,
                "category": item.category,
                "is_available": item.is_available
            }
            for item in items
        ]
    
    def purchase_item(self, user_id: int, item_id: int, quantity: int = 1) -> Dict[str, Any]:
        """아이템 구매"""
        user = self.user_service.get_user_by_id(user_id)
        item = self.db.query(models.ShopItem).filter(models.ShopItem.id == item_id).first()
        
        if not item:
            raise ValueError("Item not found")
        
        if not item.is_available:
            raise ValueError("Item is not available")
        
        total_cost = item.price * quantity
        
        # 잔액 확인 및 차감
        if item.currency == "COIN":
            if user.cyber_tokens < total_cost:
                raise ValueError("Insufficient coins")
            user.cyber_tokens -= total_cost
        elif item.currency == "GEM":
            if user.premium_gems < total_cost:
                raise ValueError("Insufficient gems")
            user.premium_gems -= total_cost
        else:
            raise ValueError(f"Unknown currency: {item.currency}")
        
        # 구매 기록 생성
        purchase = models.ShopTransaction(
            user_id=user_id,
            item_id=item_id,
            quantity=quantity,
            price_per_item=item.price,
            total_price=total_cost,
            currency=item.currency,
            timestamp=datetime.now(timezone.utc)
        )
        
        try:
            self.db.add(purchase)
            self.db.commit()
            
            # TODO: 실제 아이템 지급 로직 구현
            
            return {
                "success": True,
                "item_name": item.name,
                "quantity": quantity,
                "total_cost": total_cost,
                "remaining_balance": user.cyber_tokens if item.currency == "COIN" else user.premium_gems
            }
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
    
    def get_user_purchase_history(self, user_id: int, limit: int = 20) -> List[Dict[str, Any]]:
        """사용자 구매 내역 조회"""
        transactions = self.db.query(models.ShopTransaction)\
            .filter(models.ShopTransaction.user_id == user_id)\
            .order_by(models.ShopTransaction.timestamp.desc())\
            .limit(limit)\
            .all()
        
        return [
            {
                "item_name": trans.item.name,
                "quantity": trans.quantity,
                "total_price": trans.total_price,
                "currency": trans.currency,
                "timestamp": trans.timestamp.isoformat()
            }
            for trans in transactions
        ]
