from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.services.user_service import UserService
from app.core.database import get_db

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = UserService.get_user_by_nickname(db, user.nickname)
    if existing_user:
        raise HTTPException(status_code=400, detail="Nickname already registered")
    
    new_user = UserService.create_user(db, user)
    return new_user

@router.post("/login", response_model=UserResponse)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserService.authenticate_user(db, user.nickname, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return db_user

@router.get("/{user_id}/profile", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user