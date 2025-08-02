from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, games, gacha, shop, battlepass, feedback
from app.core.database import engine
from app.models import Base

# Initialize FastAPI application
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to restrict origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(games.router, prefix="/api/v1/games", tags=["games"])
app.include_router(gacha.router, prefix="/api/v1/gacha", tags=["gacha"])
app.include_router(shop.router, prefix="/api/v1/shop", tags=["shop"])
app.include_router(battlepass.router, prefix="/api/v1/battlepass", tags=["battlepass"])
app.include_router(feedback.router, prefix="/api/v1/feedback", tags=["feedback"])

# Create database tables
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}