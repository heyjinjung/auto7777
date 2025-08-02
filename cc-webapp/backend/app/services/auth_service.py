# -*- coding: utf-8 -*-
"""
Authentication Service
사용자 인증 관련 서비스
"""

from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt

from ..core.config import settings
from ..repositories.user_repository import UserRepository
from .. import models

# 비밀번호 해시 컨텍스트
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    """인증 서비스"""
    
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """비밀번호 검증"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """비밀번호 해시 생성"""
        return pwd_context.hash(password)
    
    def authenticate_user(self, db: Session, nickname: str, password: str) -> Optional[models.User]:
        """사용자 인증"""
        user = self.user_repo.get_by_nickname(db, nickname)
        if not user:
            return None
        if not self.verify_password(password, user.password_hash):
            return None
        return user
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """JWT 액세스 토큰 생성"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[dict]:
        """JWT 토큰 검증"""
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            return payload
        except jwt.PyJWTError:
            return None
    
    def create_user(self, db: Session, nickname: str, invite_code: str, password: Optional[str] = None) -> models.User:
        """새 사용자 생성"""
        # 기본 비밀번호 설정 (실제로는 더 안전한 방법 사용)
        if not password:
            password = "default_password"
        
        hashed_password = self.get_password_hash(password)
        
        user_data = {
            "nickname": nickname,
            "password_hash": hashed_password,
            "invite_code": invite_code,
            "cyber_tokens": settings.INITIAL_CYBER_TOKENS,
            "is_active": True,
            "created_at": datetime.utcnow()
        }
        
        return self.user_repo.create(db, user_data)
