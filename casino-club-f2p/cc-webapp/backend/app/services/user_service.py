from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: UserCreate) -> User:
        db_user = User(
            nickname=user.nickname,
            email=user.email,
            password_hash=hash_password(user.password),
            created_at=datetime.utcnow(),
            vip_tier='STANDARD',
            battlepass_level=0,
            total_spent=0
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_user(self, user_id: int) -> User:
        return self.db.query(User).filter(User.id == user_id).first()

    def update_user(self, user_id: int, user_update: UserUpdate) -> User:
        user = self.get_user(user_id)
        if user:
            for key, value in user_update.dict(exclude_unset=True).items():
                setattr(user, key, value)
            self.db.commit()
            self.db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> None:
        user = self.get_user(user_id)
        if user:
            self.db.delete(user)
            self.db.commit()