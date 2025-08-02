"""
간단한 상점 API 테스트용
"""
from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

@router.get("/test")
async def test_shop():
    """상점 API 테스트"""
    return {"message": "Shop API is working!"}

@router.get("/simple-items")
async def get_simple_items():
    """간단한 아이템 목록"""
    return [
        {
            "id": 1,
            "name": "코인 100개",
            "price": 1,
            "currency": "GEM"
        },
        {
            "id": 2,
            "name": "코인 500개", 
            "price": 5,
            "currency": "GEM"
        }
    ]
