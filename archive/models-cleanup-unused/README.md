# 모델 정리 - 미사용 파일 아카이브

**아카이브 일시**: 2025-08-02

## 아카이브된 파일들

### 1. auth_models_clean.py
- **상태**: 빈 파일
- **이유**: 내용이 없는 불필요한 파일

### 2. auth_models_fixed.py  
- **상태**: 빈 파일
- **이유**: 내용이 없는 불필요한 파일

### 3. invite_code.py
- **상태**: 빈 파일
- **이유**: 내용이 없으며, invite code 모델은 auth_models.py에 통합됨

## 정리된 모델 구조

현재 사용중인 모델 파일들:
- `auth_models.py`: 사용자 인증 관련 모델 (User, LoginAttempt, RefreshToken, UserSession, SecurityEvent)
- `game_models.py`: 게임 시스템 모델 (UserAction, UserReward, GameSession, UserActivity, Reward)
- `content_models.py`: 컨텐츠 관리 모델 (AdultContent, VIPAccessLog, Purchase, Shop, Notification)
- `analytics_models.py`: 분석 시스템 모델 (UserSegment, BattlePass, GachaPool 등)

## 해결된 문제들

1. **순환 참조 해결**: 모든 모델 파일에서 `.auth_clean`과 같은 잘못된 import 제거
2. **UTF-8 인코딩 추가**: 모든 Python 파일에 `# -*- coding: utf-8 -*-` 헤더 추가
3. **중복 파일 제거**: 사용하지 않는 중복 모델 파일들 아카이브 처리
4. **__init__.py 정리**: 올바른 import 구조로 재작성

## 복원 방법 (필요시)

아카이브된 파일을 복원하려면:
```bash
# 특정 파일 복원
copy archive\models-cleanup-unused\auth_models_clean.py cc-webapp\backend\app\models\

# 전체 복원
copy archive\models-cleanup-unused\*.py cc-webapp\backend\app\models\
```

**주의**: 복원 시 순환 참조 문제가 다시 발생할 수 있으므로 권장하지 않음
