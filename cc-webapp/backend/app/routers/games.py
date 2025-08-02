from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.services.user_service import UserService
from app.services.reward_service import RewardService
from app.services.game_service import GameService
from app.schemas.games import GamePlayRequest, GamePlayResponse

router = APIRouter()

@router.post("/play", response_model=GamePlayResponse)
async def play_game(
    game_data: GamePlayRequest = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    핵심 게임 플레이 엔드포인트
    
    - **game_type**: 게임 종류 (SLOT, RPS, ROULETTE)
    - **bet_amount**: 베팅 금액
    - **user_choice**: 사용자 선택 (가위바위보의 경우)
    
    게임 결과와 보상 정보를 반환합니다.
    """
    # 사용자 서비스 및 게임 서비스 초기화
    user_service = UserService(db)
    reward_service = RewardService(db)
    game_service = GameService(db)
    
    user_id = current_user["user_id"]
    
    # 게임 종류에 따른 플레이 처리
    if game_data.game_type == "SLOT":
        result = game_service.play_slot_game(user_id, game_data.bet_amount)
    elif game_data.game_type == "RPS":
        if not game_data.user_choice:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="RPS 게임은 user_choice가 필요합니다"
            )
        result = game_service.play_rps_game(user_id, game_data.bet_amount, game_data.user_choice)
    elif game_data.game_type == "ROULETTE":
        result = game_service.play_roulette_game(user_id, game_data.bet_amount)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"지원하지 않는 게임 타입: {game_data.game_type}"
        )
    
    # 게임 결과 반환
    return result
