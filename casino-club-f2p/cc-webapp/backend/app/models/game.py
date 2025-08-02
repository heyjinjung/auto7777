from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Game(Base):
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    popularity = Column(Integer, default=0)
    image_url = Column(String)
    created_at = Column(Integer)  # Timestamp for when the game was created
    updated_at = Column(Integer)  # Timestamp for when the game was last updated

    # Relationship with User for tracking user interactions with games
    users = relationship("User", secondary="user_games", back_populates="games")

class UserGame(Base):
    __tablename__ = 'user_games'

    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    game_id = Column(Integer, ForeignKey('games.id'), primary_key=True)