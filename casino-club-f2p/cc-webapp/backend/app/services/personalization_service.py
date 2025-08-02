from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserSegment
from app.core.database import get_db
from typing import List

class PersonalizationService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_segment(self, user_id: int) -> UserSegment:
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            return UserSegment(
                user_id=user.id,
                rfm_group=user.rfm_group,
                ltv_score=user.ltv_score,
                risk_profile=user.risk_profile,
                last_updated=user.last_updated
            )
        return None

    def update_user_segment(self, user_id: int, segment_data: UserSegment) -> UserSegment:
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.rfm_group = segment_data.rfm_group
            user.ltv_score = segment_data.ltv_score
            user.risk_profile = segment_data.risk_profile
            user.last_updated = segment_data.last_updated
            self.db.commit()
            return self.get_user_segment(user_id)
        return None

    def get_all_user_segments(self) -> List[UserSegment]:
        users = self.db.query(User).all()
        return [
            UserSegment(
                user_id=user.id,
                rfm_group=user.rfm_group,
                ltv_score=user.ltv_score,
                risk_profile=user.risk_profile,
                last_updated=user.last_updated
            ) for user in users
        ]