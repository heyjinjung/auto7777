# -*- coding: utf-8 -*-
"""
Casino-Club F2P Backend Main Application
카지노 클럽 F2P 백엔드 메인 애플리케이션
"""

from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

class _DummyScheduler:
    running = False

    def shutdown(self, wait: bool = False) -> None:  # noqa: D401
        """No-op shutdown when scheduler is unavailable."""

try:
    from .apscheduler_jobs import start_scheduler, scheduler
except Exception:  # noqa: BLE001

    def start_scheduler():
        print("Scheduler disabled or APScheduler not installed")

    scheduler = _DummyScheduler()
try:
    from prometheus_fastapi_instrumentator import Instrumentator
except ImportError:  # Optional dependency in tests
    Instrumentator = None
try:
    import sentry_sdk
except Exception:  # noqa: BLE001
    sentry_sdk = None
import os  # For Sentry DSN from env var

# Kafka integration (conditional)
try:
    from app.kafka_client import send_kafka_message
    from app.api.v1.kafka import router as kafka_router
    KAFKA_AVAILABLE = True
    print("✅ Kafka client and router loaded successfully")
except ImportError as e:
    print(f"⚠️ Kafka not available: {e}")
    KAFKA_AVAILABLE = False
    kafka_router = None
    
    # Mock Kafka function for when Kafka is not available
    def send_kafka_message(topic, message):
        print(f"🔇 Mock Kafka: {topic} -> {message}")
        return True

# Define the app first
# ... (app initialization code) ...

# Then define models and routes
class UserActionEvent(BaseModel):
    user_id: str
    action_type: str
    payload: Optional[dict] = None
from pydantic import BaseModel  # For request/response models
from typing import Optional

# 라우터 import 추가 - 조건부 로드
routers_loaded = []

# 1. 인증 라우터
try:
    from app.routers import auth
    AUTH_ROUTER_AVAILABLE = True
    routers_loaded.append("auth")
    print("✅ Auth router loaded successfully")
except Exception as e:
    print(f"⚠️ Auth router could not be loaded: {e}")
    AUTH_ROUTER_AVAILABLE = False

# 2. 사용자 라우터
try:
    from app.routers import users
    USERS_ROUTER_AVAILABLE = True
    routers_loaded.append("users")
    print("✅ Users router loaded successfully")
except Exception as e:
    print(f"⚠️ Users router could not be loaded: {e}")
    USERS_ROUTER_AVAILABLE = False

# 3. 게임 라우터들
# 3.1 RPS (가위바위보) 게임
try:
    from app.routers import rps
    RPS_ROUTER_AVAILABLE = True
    routers_loaded.append("rps")
    print("✅ RPS game router loaded successfully")
except Exception as e:
    print(f"⚠️ RPS router could not be loaded: {e}")
    RPS_ROUTER_AVAILABLE = False

# 3.2 슬롯 게임
try:
    from app.routers import slots
    SLOTS_ROUTER_AVAILABLE = True
    routers_loaded.append("slots")
    print("✅ Slots game router loaded successfully")
except Exception as e:
    print(f"⚠️ Slots router could not be loaded: {e}")
    SLOTS_ROUTER_AVAILABLE = False

# 3.3 룰렛 게임
try:
    from app.routers import roulette
    ROULETTE_ROUTER_AVAILABLE = True
    routers_loaded.append("roulette")
    print("✅ Roulette game router loaded successfully")
except Exception as e:
    print(f"⚠️ Roulette router could not be loaded: {e}")
    ROULETTE_ROUTER_AVAILABLE = False

# 4. 가챠 라우터
try:
    from app.routers import gacha
    GACHA_ROUTER_AVAILABLE = True
    routers_loaded.append("gacha")
    print("✅ Gacha router loaded successfully")
except Exception as e:
    print(f"⚠️ Gacha router could not be loaded: {e}")
    GACHA_ROUTER_AVAILABLE = False

# 5. 상점 라우터
try:
    from app.routers import shop
    SHOP_ROUTER_AVAILABLE = True
    routers_loaded.append("shop")
    print("✅ Shop router loaded successfully")
except Exception as e:
    print(f"⚠️ Shop router could not be loaded: {e}")
    SHOP_ROUTER_AVAILABLE = False

# 6. 배틀패스 라우터
try:
    from app.routers import battlepass
    BATTLEPASS_ROUTER_AVAILABLE = True
    routers_loaded.append("battlepass")
    print("✅ BattlePass router loaded successfully")
except Exception as e:
    print(f"⚠️ BattlePass router could not be loaded: {e}")
    BATTLEPASS_ROUTER_AVAILABLE = False

# 7. 보상 라우터
try:
    from app.routers import rewards
    REWARDS_ROUTER_AVAILABLE = True
    routers_loaded.append("rewards")
    print("✅ Rewards router loaded successfully")
except Exception as e:
    print(f"⚠️ Rewards router could not be loaded: {e}")
    REWARDS_ROUTER_AVAILABLE = False

# 8. 대시보드 라우터
try:
    from app.routers import dashboard
    DASHBOARD_ROUTER_AVAILABLE = True
    routers_loaded.append("dashboard")
    print("✅ Dashboard router loaded successfully")
except Exception as e:
    print(f"⚠️ Dashboard router could not be loaded: {e}")
    DASHBOARD_ROUTER_AVAILABLE = False

print(f"✅ Successfully loaded routers: {routers_loaded}")

# JWT 인증 API 임포트 추가
try:
    from app.routers import simple_auth  # PostgreSQL 기반 간단한 인증 라우터
    SIMPLE_AUTH_AVAILABLE = True
    print("✅ Simple Auth API 모듈 로드 성공")
except ImportError as e:
    SIMPLE_AUTH_AVAILABLE = False
    print(f"⚠️ Warning: Simple Auth API not available: {e}")
except Exception as e:
    SIMPLE_AUTH_AVAILABLE = False
    print(f"❌ Error loading Simple Auth API: {e}")

# Kafka API 임포트 추가 (이미 위에서 처리됨)

# --- Sentry Initialization (Placeholder - should be configured properly with DSN) ---
# It's good practice to initialize Sentry as early as possible.
# The DSN should be configured via an environment variable for security and flexibility.
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN and sentry_sdk:
    try:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment=os.getenv("ENVIRONMENT", "development"),
        )
        print("Sentry SDK initialized successfully.")
    except Exception as e:  # noqa: BLE001
        print(f"Error: Failed to initialize Sentry SDK. {e}")
else:
    print(
        "Warning: SENTRY_DSN not found or sentry_sdk missing. Sentry not initialized."
    )
# --- End Sentry Initialization Placeholder ---

# 로깅 시스템 및 에러 핸들러 임포트
from app.core.logging import setup_logging, LoggingContextMiddleware
from app.core.error_handlers import add_exception_handlers, error_handling_middleware

# 로깅 시스템 초기화
log_level = "DEBUG" if os.getenv("ENVIRONMENT", "development") != "production" else "INFO"
setup_logging(level=log_level)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    if os.getenv("DISABLE_SCHEDULER") != "1":
        print("FastAPI startup event: Initializing job scheduler...")
        start_scheduler()
    yield
    # Shutdown logic
    print("FastAPI shutdown event: Shutting down scheduler...")
    if scheduler.running:
        scheduler.shutdown(wait=False)

app = FastAPI(
    lifespan=lifespan,
    title="🎰 Casino-Club F2P API",
    description="""
# ♣️ Casino-Club F2P 종합 백엔드 API

이 문서는 **완전히 재구축되고 안정화된** Casino-Club F2P 프로젝트의 API 명세입니다.

## 🚀 핵심 철학
- **안정성 우선:** 모든 API는 명확한 서비스 계층과 단위 테스트를 통해 안정성을 확보했습니다.
- **사용자 여정 중심:** API는 '회원가입 → 게임 플레이 → 보상'의 자연스러운 사용자 흐름에 맞춰 설계되었습니다.
- **확장성:** 신규 게임, 미션, 이벤트 등을 쉽게 추가할 수 있는 모듈식 구조를 지향합니다.

## ✨ 주요 기능 API
- **인증 (`/api/auth`):** `5858` 초대코드 기반 회원가입 및 JWT 토큰 발급
- **사용자 (`/api/users`):** 프로필 및 보상 내역 조회
- **게임 (`/api/games`):** 슬롯, 룰렛, 가위바위보 등 핵심 게임 플레이
- **상점 (`/api/shop`):** 아이템 구매
- **관리자 (`/api/admin`):** 사용자 관리 및 데이터 조회
- **대시보드 (`/api/dashboard`):** 핵심 지표 및 통계 제공

    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name": "Jules - AI Software Engineer",
        "url": "https://github.com/google/generative-ai-docs",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
    tags_metadata=[
        {
            "name": "Simple Auth",
            "description": "사용자 인증 및 계정 관리 API",
            "externalDocs": {
                "description": "인증 시스템 가이드",
                "url": "/docs/auth-guide",
            },
        },
        {
            "name": "Users",
            "description": "사용자 프로필 및 정보 관리 API",
        },
        {
            "name": "Kafka",
            "description": "실시간 이벤트 발행 및 메시징 시스템",
        },
        {
            "name": "Event",
            "description": "사용자 행동 이벤트 추적",
        },
        {
            "name": "Authentication",
            "description": "로그인 및 토큰 기반 인증",
        },
        {
            "name": "System",
            "description": "시스템 상태 확인 및 모니터링",
        },
    ]
)

# Prometheus Instrumentation
if Instrumentator:
    instrumentator = Instrumentator(
        should_group_status_codes=True,
        should_instrument_requests_inprogress=True,
        excluded_handlers=["/metrics"],
        inprogress_labels=True,
    )
    instrumentator.instrument(app)
    instrumentator.expose(
        app, include_in_schema=False, endpoint="/metrics", tags=["monitoring"]
    )


# Configure CORS
origins = [
    "http://localhost:3000",  # Assuming Next.js runs on port 3000
    "http://localhost:3001",  # Next.js dev server on port 3001
    "http://localhost:3002",  # Next.js dev server on port 3002 (현재 사용 중)
    "http://139.180.155.143:3000",  # 프로덕션 프론트엔드
    "https://139.180.155.143:3000",  # HTTPS 지원
    # Add other origins if needed
]

# 에러 핸들러 등록
add_exception_handlers(app)

# 에러 핸들링 미들웨어 등록
app.add_middleware(error_handling_middleware)

# 로깅 컨텍스트 미들웨어 등록
app.add_middleware(LoggingContextMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
# 1. 인증 라우터
if SIMPLE_AUTH_AVAILABLE:
    app.include_router(simple_auth.router, prefix="/api", tags=["Simple Auth"])
    print("✅ Simple Auth API endpoints registered")
elif AUTH_ROUTER_AVAILABLE:
    try:
        app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
        print("✅ Auth API registered")
    except Exception as e:
        print(f"❌ Error registering Auth router: {e}")
else:
    print("⚠️ No Auth API available")

# 2. 사용자 라우터
if USERS_ROUTER_AVAILABLE:
    try:
        app.include_router(users.router, prefix="/api/users", tags=["Users"])
        print("✅ Users API registered")
    except Exception as e:
        print(f"❌ Error registering Users router: {e}")
else:
    print("⚠️ Users API not available")

# 3. 게임 라우터들
# 3.0 통합 게임 라우터
try:
    from app.routers import games
    GAMES_ROUTER_AVAILABLE = True
    app.include_router(games.router, prefix="/api/games", tags=["🎮 게임"])
    print("✅ Integrated Games API registered")
except Exception as e:
    print(f"❌ Error registering Games router: {e}")
    GAMES_ROUTER_AVAILABLE = False

# 3.1 RPS (가위바위보) 게임
if RPS_ROUTER_AVAILABLE:
    try:
        app.include_router(rps.router, prefix="/api/games/rps", tags=["🎮 게임"])
        print("✅ RPS game API registered")
    except Exception as e:
        print(f"❌ Error registering RPS router: {e}")
else:
    print("⚠️ RPS game API not available")

# 3.2 슬롯 게임
if SLOTS_ROUTER_AVAILABLE:
    try:
        app.include_router(slots.router, prefix="/api/games/slots", tags=["🎮 게임"])
        print("✅ Slots game API registered") 
    except Exception as e:
        print(f"❌ Error registering Slots router: {e}")
else:
    print("⚠️ Slots game API not available")

# 3.3 룰렛 게임
if ROULETTE_ROUTER_AVAILABLE:
    try:
        app.include_router(roulette.router, prefix="/api/games/roulette", tags=["🎮 게임"])
        print("✅ Roulette game API registered")
    except Exception as e:
        print(f"❌ Error registering Roulette router: {e}")
else:
    print("⚠️ Roulette game API not available")

# 4. 가챠 라우터
if GACHA_ROUTER_AVAILABLE:
    try:
        app.include_router(gacha.router, prefix="/api/gacha", tags=["Gacha"])
        print("✅ Gacha API registered")
    except Exception as e:
        print(f"❌ Error registering Gacha router: {e}")
else:
    print("⚠️ Gacha API not available")

# 5. 상점 라우터
if SHOP_ROUTER_AVAILABLE:
    try:
        app.include_router(shop.router, prefix="/api/shop", tags=["Shop"])
        print("✅ Shop API registered")
    except Exception as e:
        print(f"❌ Error registering Shop router: {e}")
else:
    print("⚠️ Shop API not available")

# 6. 배틀패스 라우터
if BATTLEPASS_ROUTER_AVAILABLE:
    try:
        app.include_router(battlepass.router, prefix="/api/battlepass", tags=["BattlePass"])
        print("✅ BattlePass API registered")
    except Exception as e:
        print(f"❌ Error registering BattlePass router: {e}")
else:
    print("⚠️ BattlePass API not available")

# 7. 보상 라우터
if REWARDS_ROUTER_AVAILABLE:
    try:
        app.include_router(rewards.router, prefix="/api/rewards", tags=["Rewards"])
        print("✅ Rewards API registered")
    except Exception as e:
        print(f"❌ Error registering Rewards router: {e}")
else:
    print("⚠️ Rewards API not available")

# 8. 대시보드 라우터
if DASHBOARD_ROUTER_AVAILABLE:
    try:
        app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
        print("✅ Dashboard API registered")
    except Exception as e:
        print(f"❌ Error registering Dashboard router: {e}")
else:
    print("⚠️ Dashboard API not available")

# Kafka API 라우터 등록 (가능한 경우에만)
if KAFKA_AVAILABLE:
    app.include_router(kafka_router)
    print("✅ Kafka API endpoints registered")
else:
    print("⚠️ Kafka API endpoints not available")

# Kafka integration route
@app.post("/api/kafka/publish", tags=["Kafka", "Event"])
async def publish_user_action_event(event: UserActionEvent = Body(...)):
    """
    사용자 행동 이벤트를 Kafka로 발행 (샘플)
    - topic: user_actions
    - value: {user_id, action_type, payload}
    """
    send_kafka_message("user_actions", event.model_dump())
    return {"status": "ok", "message": "Event published to Kafka", "event": event.model_dump()}

# Request/Response Models
class UserLogin(BaseModel):
    """사용자 로그인 스키마"""

    user_id: str
    password: str


class LoginResponse(BaseModel):
    """로그인 응답 스키마"""

    token: str
    user_id: str
    message: Optional[str] = None


@app.post("/login", response_model=LoginResponse, tags=["Authentication"])
async def login(user: UserLogin):
    """
    사용자 로그인 엔드포인트

    - **user_id**: 사용자 ID
    - **password**: 비밀번호
    - 성공 시 JWT 토큰 반환
    """
    # 실제 로직은 추후 구현
    if user.user_id == "test" and user.password == "password":
        return {
            "token": "sample_jwt_token",
            "user_id": user.user_id,
            "message": "로그인 성공",
        }
    raise HTTPException(status_code=401, detail="인증 실패")


@app.get("/health", tags=["System"])
@app.head("/health", tags=["System"])
async def health_check():
    """
    시스템 상태 확인 엔드포인트

    - 서버 정상 동작 여부 확인
    - 헬스체크 용도
    - GET 및 HEAD 메서드 모두 지원
    """
    return {"status": "healthy"}
