# -*- coding: utf-8 -*-
"""
User Repository
사용자 데이터 액세스 계층
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_

from .. import models

class UserRepository:
    """사용자 리포지토리"""
    
    def get_by_id(self, db: Session, user_id: int) -> Optional[models.User]:
        """ID로 사용자 조회"""
        return db.query(models.User).filter(models.User.id == user_id).first()
    
    def get_by_nickname(self, db: Session, nickname: str) -> Optional[models.User]:
        """닉네임으로 사용자 조회"""
        return db.query(models.User).filter(models.User.nickname == nickname).first()
    
    def get_by_email(self, db: Session, email: str) -> Optional[models.User]:
        """이메일로 사용자 조회"""
        return db.query(models.User).filter(models.User.email == email).first()
    
    def create(self, db: Session, user_data: dict) -> models.User:
        """새 사용자 생성"""
        user = models.User(**user_data)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    def update(self, db: Session, user_id: int, update_data: dict) -> Optional[models.User]:
        """사용자 정보 업데이트"""
        user = self.get_by_id(db, user_id)
        if user:
            for key, value in update_data.items():
                setattr(user, key, value)
            db.commit()
            db.refresh(user)
        return user
    
    def delete(self, db: Session, user_id: int) -> bool:
        """사용자 삭제"""
        user = self.get_by_id(db, user_id)
        if user:
            db.delete(user)
            db.commit()
            return True
        return False
    
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
        """모든 사용자 조회 (페이징)"""
        return db.query(models.User).offset(skip).limit(limit).all()
    
    def get_active_users(self, db: Session) -> List[models.User]:
        """활성 사용자 조회"""
        return db.query(models.User).filter(models.User.is_active == True).all()
    
    def update_tokens(self, db: Session, user_id: int, token_change: int) -> Optional[models.User]:
        """사용자 토큰 업데이트"""
        user = self.get_by_id(db, user_id)
        if user:
            user.cyber_tokens += token_change
            db.commit()
            db.refresh(user)
        return user
