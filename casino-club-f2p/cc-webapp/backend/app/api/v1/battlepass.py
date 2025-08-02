from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import BattlePass
from app.schemas import BattlePassCreate, BattlePassUpdate
from app.api.deps import get_db

router = APIRouter()

@router.post("/", response_model=BattlePass)
def create_battlepass(battlepass: BattlePassCreate, db: Session = Depends(get_db)):
    db_battlepass = BattlePass(**battlepass.dict())
    db.add(db_battlepass)
    db.commit()
    db.refresh(db_battlepass)
    return db_battlepass

@router.get("/{battlepass_id}", response_model=BattlePass)
def read_battlepass(battlepass_id: int, db: Session = Depends(get_db)):
    battlepass = db.query(BattlePass).filter(BattlePass.id == battlepass_id).first()
    if battlepass is None:
        raise HTTPException(status_code=404, detail="BattlePass not found")
    return battlepass

@router.put("/{battlepass_id}", response_model=BattlePass)
def update_battlepass(battlepass_id: int, battlepass: BattlePassUpdate, db: Session = Depends(get_db)):
    db_battlepass = db.query(BattlePass).filter(BattlePass.id == battlepass_id).first()
    if db_battlepass is None:
        raise HTTPException(status_code=404, detail="BattlePass not found")
    for key, value in battlepass.dict(exclude_unset=True).items():
        setattr(db_battlepass, key, value)
    db.commit()
    db.refresh(db_battlepass)
    return db_battlepass

@router.delete("/{battlepass_id}", response_model=dict)
def delete_battlepass(battlepass_id: int, db: Session = Depends(get_db)):
    db_battlepass = db.query(BattlePass).filter(BattlePass.id == battlepass_id).first()
    if db_battlepass is None:
        raise HTTPException(status_code=404, detail="BattlePass not found")
    db.delete(db_battlepass)
    db.commit()
    return {"detail": "BattlePass deleted successfully"}