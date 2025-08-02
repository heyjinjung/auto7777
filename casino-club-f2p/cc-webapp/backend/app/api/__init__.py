from fastapi import APIRouter

router = APIRouter()

# Include versioned API routes
from .v1 import auth, users, games, gacha, shop, battlepass, feedback

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(games.router, prefix="/games", tags=["games"])
router.include_router(gacha.router, prefix="/gacha", tags=["gacha"])
router.include_router(shop.router, prefix="/shop", tags=["shop"])
router.include_router(battlepass.router, prefix="/battlepass", tags=["battlepass"])
router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])