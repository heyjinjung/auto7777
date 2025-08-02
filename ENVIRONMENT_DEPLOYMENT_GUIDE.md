# Casino-Club F2P 환경별 배포 가이드

## 🚀 환경 구성

### 개발환경 (Development)
```bash
# 개발 도구 포함 시작
.\docker-manage.ps1 start --tools

# 개별 서비스 재시작
.\docker-manage.ps1 restart frontend
.\docker-manage.ps1 restart backend
```

### 스테이징환경 (Staging)
```bash
# 스테이징 환경으로 시작
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

### 프로덕션환경 (Production)
```bash
# 프로덕션 환경으로 시작
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔧 환경별 특성

| 환경 | 특성 | 도구 | 빌드 |
|-----|------|------|------|
| Development | 핫 리로드, 디버그 모드 | pgAdmin, Redis Commander, Kafka UI | 빠른 빌드 |
| Staging | 프로덕션 유사, 테스트 | 모니터링 도구 | 최적화 빌드 |
| Production | 성능 최적화, 보안 강화 | 모니터링, 로깅 | 최적화 빌드 |

## 📊 성능 최적화

### 프론트엔드 최적화
- Next.js Standalone 빌드
- 이미지 최적화 (WebP, AVIF)
- 코드 분할 및 번들 최적화

### 백엔드 최적화
- Gunicorn 멀티 워커
- 데이터베이스 연결 풀링
- Redis 캐싱 전략

### 인프라 최적화
- Docker 멀티스테이지 빌드
- 볼륨 최적화
- 네트워크 세분화

## 🛡️ 보안 강화

### 컨테이너 보안
- 비루트 사용자 실행
- 읽기 전용 파일 시스템
- 최소 권한 원칙

### 네트워크 보안
- 내부 네트워크 격리
- HTTPS 강제
- API 레이트 리미팅

### 데이터 보안
- 환경변수 암호화
- 시크릿 관리
- 정기 백업
