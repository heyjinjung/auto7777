# -*- coding: utf-8 -*-
"""
모델 패키지 - 전체 시스템
통합된 모델 시스템으로 모든 기능 지원
"""

# Base 클래스 먼저 import
from app.database import Base

# Auth 모델들
from .auth_models import (
    User,
    LoginAttempt,
    RefreshToken,
    UserSession,
    SecurityEvent,
    InviteCode,
)

# Game 모델들
from .game_models import (
    UserAction,
    UserReward,
    GameSession,
    UserActivity,
    Reward,
)

# Content 모델들
from .content_models import (
    AdultContent,
    VIPAccessLog,
    Purchase,
    Shop,
    Notification,
)

# Analytics 모델들
from .analytics_models import (
    UserSegment,
    BattlePass,
    BattlePassProgress,
    BattlePassReward,
    BattlePassClaimed,
    GachaPool,
)

# 모든 모델을 __all__로 정의
__all__ = [
    # Auth models
    "User",
    "LoginAttempt",
    "RefreshToken", 
    "UserSession",
    "SecurityEvent",
    "InviteCode",
    
    # Game models
    "UserAction",
    "UserReward",
    "GameSession",
    "UserActivity",
    "Reward",
    
    # Content models
    "AdultContent",
    "VIPAccessLog",
    "Purchase",
    "Shop",
    "Notification",
    
    # Analytics models
    "UserSegment",
    "BattlePass",
    "BattlePassProgress",
    "BattlePassReward",
    "BattlePassClaimed",
    "GachaPool",
]

# 모든 모델 클래스들을 리스트로 정의
__all__ = [
    # Base
    "Base",
    
    # Auth
    "User",
    "InviteCode", 
    "LoginAttempt",
    "RefreshToken",
    "UserSession",
    "SecurityEvent",
    
    # Game
    "UserAction",
    "UserReward",
    "GameSession", 
    "UserActivity",
    "Reward",
    
    # Content
    "AdultContent",
    "VIPAccessLog",
    "Purchase",
    "Shop",
    "Notification",
    
    # Analytics
    "UserSegment",
    "BattlePass",
    "BattlePassProgress",
    "BattlePassReward",
    "BattlePassClaimed",
    "GachaPool",
    "GachaItem",
    "GachaLog",
]

