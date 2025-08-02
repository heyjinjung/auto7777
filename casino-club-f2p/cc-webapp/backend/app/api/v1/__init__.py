from fastapi import APIRouter

router = APIRouter()

# Include your API routes here
# Example: 
# from .auth import router as auth_router
# router.include_router(auth_router, prefix="/auth", tags=["auth"]) 

# Add more routes as needed for users, games, gacha, shop, battlepass, and feedback
# Example:
# from .users import router as users_router
# router.include_router(users_router, prefix="/users", tags=["users"]) 

# Ensure to define the necessary API endpoints in their respective modules.