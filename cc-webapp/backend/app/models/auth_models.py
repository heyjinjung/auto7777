"""
JWT 인증 고급 기능 모델
- 로그인 시도 제한
- 리프레시 토큰 관리
- 세션 관리
- 강제 로그아웃
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class LoginAttempt(Base):
    """로그인 시도 기록 테이블"""
    __tablename__ = "login_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(String(50), nullable=False, index=True)
    ip_address = Column(String(45), nullable=False, index=True)  # IPv6 지원
    success = Column(Boolean, nullable=False, index=True)
    attempted_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    user_agent = Column(String(500), nullable=True)
    failure_reason = Column(String(100), nullable=True)  # "invalid_password", "invalid_site_id", "account_locked" 등
    
    # 성능 최적화를 위한 복합 인덱스
    __table_args__ = (
        Index("ix_login_attempts_site_id_attempted_at", "site_id", "attempted_at"),
        Index("ix_login_attempts_ip_attempted_at", "ip_address", "attempted_at"),
    )


class RefreshToken(Base):
    """리프레시 토큰 관리 테이블"""
    __tablename__ = "refresh_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(128), unique=True, nullable=False, index=True)  # SHA-256 해시
    device_fingerprint = Column(String(128), nullable=True, index=True)  # 디바이스 식별
    ip_address = Column(String(45), nullable=False)
    user_agent = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False, index=True)
    last_used_at = Column(DateTime, nullable=True)
    is_revoked = Column(Boolean, default=False, nullable=False, index=True)
    revoked_at = Column(DateTime, nullable=True)
    revoke_reason = Column(String(50), nullable=True)  # "logout", "force_logout", "security", "expired"
    
    # 관계
    user = relationship("User")
    
    # 인덱스
    __table_args__ = (
        Index("ix_refresh_tokens_user_id_created_at", "user_id", "created_at"),
        Index("ix_refresh_tokens_expires_at_revoked", "expires_at", "is_revoked"),
    )


class UserSession(Base):
    """사용자 세션 관리 테이블"""
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(String(128), unique=True, nullable=False, index=True)  # UUID 또는 JWT JTI
    device_fingerprint = Column(String(128), nullable=True, index=True)
    ip_address = Column(String(45), nullable=False, index=True)
    user_agent = Column(String(500), nullable=True)
    login_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    last_activity_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    logout_at = Column(DateTime, nullable=True)
    logout_reason = Column(String(50), nullable=True)  # "user_logout", "force_logout", "timeout", "security"
    
    # 관계
    user = relationship("User")
    
    # 인덱스
    __table_args__ = (
        Index("ix_user_sessions_user_id_active", "user_id", "is_active"),
        Index("ix_user_sessions_last_activity_active", "last_activity_at", "is_active"),
        Index("ix_user_sessions_expires_at_active", "expires_at", "is_active"),
    )


class SecurityEvent(Base):
    """보안 이벤트 로그 테이블"""
    __tablename__ = "security_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)  # "login_failure", "account_locked", "force_logout" 등
    severity = Column(String(20), default="INFO", nullable=False, index=True)  # "INFO", "WARNING", "CRITICAL"
    description = Column(String(500), nullable=False)
    ip_address = Column(String(45), nullable=False, index=True)
    user_agent = Column(String(500), nullable=True)
    metadata = Column(String(1000), nullable=True)  # JSON 문자열로 추가 정보 저장
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # 관계
    user = relationship("User")
    
    # 인덱스
    __table_args__ = (
        Index("ix_security_events_type_created_at", "event_type", "created_at"),
        Index("ix_security_events_severity_created_at", "severity", "created_at"),
        Index("ix_security_events_user_id_created_at", "user_id", "created_at"),
    )
