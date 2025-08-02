from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .models import User
from .database import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    """
    현재 로그인된 사용자 정보를 가져옵니다.
    """
    # 단순화를 위해 임시로 토큰 체크 없이 사용자 정보 반환
    # 실제 환경에서는 제대로 된 JWT 검증이 필요합니다
    return {"user_id": 1, "username": "test_user"}

def get_current_admin(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    user = db.query(User).filter(User.token == token).first()
    if not user or not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized as admin",
        )
    return user
