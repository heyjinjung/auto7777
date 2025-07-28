from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Casino-Club F2P Backend", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Casino-Club F2P Backend is running!", "status": "ok"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "casino-club-backend"}

@app.get("/api/admin/stats")
async def get_admin_stats():
    return {
        "totalUsers": 150,
        "activeUsers": 89,
        "totalRewards": 45000,
        "todayActivities": 234
    }

@app.get("/api/admin/activities")
async def get_admin_activities():
    return {
        "items": [
            {"id": 1, "activity_type": "LOGIN", "details": "사용자 로그인", "timestamp": "2025-07-28T20:30:00Z"},
            {"id": 2, "activity_type": "GAME_PLAY", "details": "슬롯머신 게임", "timestamp": "2025-07-28T20:25:00Z"},
            {"id": 3, "activity_type": "REWARD_RECEIVED", "details": "토큰 100개 획득", "timestamp": "2025-07-28T20:20:00Z"},
            {"id": 4, "activity_type": "SIGNUP", "details": "신규 사용자 가입", "timestamp": "2025-07-28T20:15:00Z"},
            {"id": 5, "activity_type": "PURCHASE", "details": "프리미엄 아이템 구매", "timestamp": "2025-07-28T20:10:00Z"}
        ],
        "total": 5,
        "page": 1,
        "limit": 10
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
