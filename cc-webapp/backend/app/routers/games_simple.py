# -*- coding: utf-8 -*-
"""
간단한 게임 API 라우터 - FINAL_VERIFICATION_GUIDE 대응
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Literal
import random

from ..database import get_db

router = APIRouter()

# === Request/Response Models ===

class RPSPlayRequest(BaseModel):
    """가위바위보 게임 요청"""
    user_choice: Literal["rock", "paper", "scissors"]
    bet_amount: int = Field(..., ge=1000, le=50000)

class RPSPlayResponse(BaseModel):
    """가위바위보 게임 응답"""
    user_choice: str
    computer_choice: str
    result: str
    tokens_change: int
    message: str

class SlotSpinRequest(BaseModel):
    """슬롯 게임 요청"""
    bet_amount: int = Field(..., ge=1000, le=50000)

class SlotSpinResponse(BaseModel):
    """슬롯 게임 응답"""
    symbols: list
    result: str
    tokens_change: int
    message: str

class RouletteSpinRequest(BaseModel):
    """룰렛 게임 요청"""
    bet_amount: int = Field(..., ge=1000, le=50000)
    bet_type: Literal["red", "black", "number"]
    bet_value: int = Field(None, ge=0, le=36)  # 숫자 베팅시에만 사용

class RouletteSpinResponse(BaseModel):
    """룰렛 게임 응답"""
    number: int
    color: str
    result: str
    tokens_change: int
    message: str

# === Game Endpoints ===

@router.post("/rps/play", response_model=RPSPlayResponse, summary="가위바위보 게임")
async def play_rps(request: RPSPlayRequest, db: Session = Depends(get_db)):
    """
    가위바위보 게임 플레이
    
    - **user_choice**: rock, paper, scissors 중 선택
    - **bet_amount**: 베팅 금액 (1,000 ~ 50,000)
    """
    # 컴퓨터 선택
    computer_choice = random.choice(["rock", "paper", "scissors"])
    
    # 게임 결과 계산
    if request.user_choice == computer_choice:
        result = "draw"
        tokens_change = 0
        message = "무승부! 베팅 금액이 반환됩니다."
    elif (
        (request.user_choice == "rock" and computer_choice == "scissors") or
        (request.user_choice == "paper" and computer_choice == "rock") or
        (request.user_choice == "scissors" and computer_choice == "paper")
    ):
        result = "win"
        tokens_change = request.bet_amount
        message = f"승리! {request.bet_amount}토큰을 획득했습니다!"
    else:
        result = "lose"
        tokens_change = -request.bet_amount
        message = f"패배! {request.bet_amount}토큰을 잃었습니다."
    
    return RPSPlayResponse(
        user_choice=request.user_choice,
        computer_choice=computer_choice,
        result=result,
        tokens_change=tokens_change,
        message=message
    )

@router.post("/slot/spin", response_model=SlotSpinResponse, summary="슬롯 게임")
async def spin_slot(request: SlotSpinRequest, db: Session = Depends(get_db)):
    """
    슬롯 머신 게임 플레이
    
    - **bet_amount**: 베팅 금액 (1,000 ~ 50,000)
    """
    # 슬롯 심볼들
    symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎"]
    
    # 3개의 랜덤 심볼 생성
    result_symbols = [random.choice(symbols) for _ in range(3)]
    
    # 결과 계산
    if len(set(result_symbols)) == 1:  # 모든 심볼이 같음
        if result_symbols[0] == "💎":
            result = "jackpot"
            tokens_change = request.bet_amount * 10
            message = f"💎 잭팟! {tokens_change}토큰 대박!"
        elif result_symbols[0] == "⭐":
            result = "big_win"
            tokens_change = request.bet_amount * 5
            message = f"⭐ 빅윈! {tokens_change}토큰 획득!"
        else:
            result = "win"
            tokens_change = request.bet_amount * 3
            message = f"승리! {tokens_change}토큰 획득!"
    elif len(set(result_symbols)) == 2:  # 2개가 같음
        result = "small_win"
        tokens_change = request.bet_amount // 2
        message = f"소승! {tokens_change}토큰 획득!"
    else:
        result = "lose"
        tokens_change = -request.bet_amount
        message = f"패배! {request.bet_amount}토큰을 잃었습니다."
    
    return SlotSpinResponse(
        symbols=result_symbols,
        result=result,
        tokens_change=tokens_change,
        message=message
    )

@router.post("/roulette/spin", response_model=RouletteSpinResponse, summary="룰렛 게임")
async def spin_roulette(request: RouletteSpinRequest, db: Session = Depends(get_db)):
    """
    룰렛 게임 플레이
    
    - **bet_amount**: 베팅 금액 (1,000 ~ 50,000)
    - **bet_type**: red, black, number 중 선택
    - **bet_value**: 숫자 베팅시 0~36 입력
    """
    # 랜덤 숫자 생성 (0~36)
    number = random.randint(0, 36)
    
    # 색상 결정 (0은 초록, 홀수는 빨강, 짝수는 검정)
    if number == 0:
        color = "green"
    elif number % 2 == 1:
        color = "red"
    else:
        color = "black"
    
    # 결과 계산
    if request.bet_type == "number":
        if request.bet_value == number:
            result = "win"
            tokens_change = request.bet_amount * 35  # 숫자 정확히 맞춤
            message = f"숫자 적중! {tokens_change}토큰 대박!"
        else:
            result = "lose"
            tokens_change = -request.bet_amount
            message = f"빗나갔습니다. {request.bet_amount}토큰을 잃었습니다."
    else:  # red or black
        if request.bet_type == color:
            result = "win"
            tokens_change = request.bet_amount
            message = f"{color.upper()} 적중! {tokens_change}토큰 획득!"
        else:
            result = "lose"
            tokens_change = -request.bet_amount
            message = f"빗나갔습니다. {request.bet_amount}토큰을 잃었습니다."
    
    return RouletteSpinResponse(
        number=number,
        color=color,
        result=result,
        tokens_change=tokens_change,
        message=message
    )

# === 게임 정보 API ===

@router.get("/info", summary="게임 정보")
async def get_games_info():
    """사용가능한 게임들의 정보를 반환합니다."""
    return {
        "games": [
            {
                "name": "가위바위보",
                "path": "/api/games/rps/play",
                "min_bet": 1000,
                "max_bet": 50000,
                "description": "클래식 가위바위보 게임"
            },
            {
                "name": "슬롯머신",
                "path": "/api/games/slot/spin", 
                "min_bet": 1000,
                "max_bet": 50000,
                "description": "3릴 슬롯머신 게임"
            },
            {
                "name": "룰렛",
                "path": "/api/games/roulette/spin",
                "min_bet": 1000, 
                "max_bet": 50000,
                "description": "유럽식 룰렛 게임"
            }
        ]
    }
