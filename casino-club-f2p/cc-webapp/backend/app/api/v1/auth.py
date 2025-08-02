from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService
from app.core.database import get_db
from app.core.security import create_access_token

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = UserService.get_user_by_nickname(db, user.nickname)
    if existing_user:
        raise HTTPException(status_code=400, detail="Nickname already registered")
    
    new_user = UserService.create_user(db, user)
    return new_user

@router.post("/login", response_model=str)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserService.authenticate_user(db, user.nickname, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.nickname})
    return access_token