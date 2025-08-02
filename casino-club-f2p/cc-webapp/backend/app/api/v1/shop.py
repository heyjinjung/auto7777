from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.schemas.response import ShopItemResponse
from app.services.user_service import get_current_user
from app.core.database import get_db

router = APIRouter()

@router.get("/items", response_model=list[ShopItemResponse])
async def get_shop_items(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    try:
        items = db.query(Transaction).all()  # Replace with actual shop item query
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/purchase/{item_id}", response_model=ShopItemResponse)
async def purchase_item(item_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    try:
        # Logic to handle item purchase
        item = db.query(Transaction).filter(Transaction.id == item_id).first()  # Replace with actual item retrieval
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Implement purchase logic here
        
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))