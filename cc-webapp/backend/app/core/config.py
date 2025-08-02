# -*- coding: utf-8 -*-
"""
Casino-Club F2P 설정 모듈
"""

import os
from typing import Optional

class Settings:
    """애플리케이션 설정"""
    
    # 데이터베이스 설정
    DB_HOST: str = os.getenv("DB_HOST", "postgres")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "cc_webapp")
    DB_USER: str = os.getenv("DB_USER", "cc_user")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "cc_secret_password_2025")
    
    # JWT 설정
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "casino_club_jwt_secret_key_20250802_very_secure")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))
    
    # 앱 설정
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # 토큰 설정
    INITIAL_CYBER_TOKENS: int = int(os.getenv("INITIAL_CYBER_TOKENS", "200"))
    
    # 본사 연동 설정
    CORPORATE_SITE_URL: str = os.getenv("CORPORATE_SITE_URL", "http://localhost:8080")
    CORPORATE_API_KEY: str = os.getenv("CORPORATE_API_KEY", "test_api_key_20250802")
    
    # 인증 설정
    AUTHORIZED_USERS_ONLY: bool = os.getenv("AUTHORIZED_USERS_ONLY", "true").lower() == "true"
    
    @property
    def database_url(self) -> str:
        """데이터베이스 URL 생성"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

# 전역 설정 인스턴스
settings = Settings()
