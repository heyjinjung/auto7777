from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Feedback(BaseModel):
    user_id: int
    message: str

class FeedbackResponse(BaseModel):
    id: int
    user_id: int
    message: str

feedback_storage = []

@router.post("/feedback", response_model=FeedbackResponse)
async def create_feedback(feedback: Feedback):
    feedback_id = len(feedback_storage) + 1
    feedback_response = FeedbackResponse(id=feedback_id, **feedback.dict())
    feedback_storage.append(feedback_response)
    return feedback_response

@router.get("/feedback", response_model=List[FeedbackResponse])
async def get_feedback():
    if not feedback_storage:
        raise HTTPException(status_code=404, detail="No feedback found")
    return feedback_storage