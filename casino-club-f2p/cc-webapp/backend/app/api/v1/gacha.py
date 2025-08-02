from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.models import Gacha
from app.schemas import GachaResponse
from app.dependencies import get_db

router = APIRouter()

@router.post("/spin", response_model=GachaResponse)
def spin_gacha(user_id: int, db: Session = Depends(get_db)):
    # Logic for spinning the gacha and determining the outcome
    try:
        # Example logic to determine the outcome
        result = Gacha.spin(user_id)
        return GachaResponse(success=True, item=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))