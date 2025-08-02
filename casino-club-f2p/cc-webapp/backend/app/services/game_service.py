from sqlalchemy.orm import Session
from app.models.game import Game
from app.schemas.game import GameCreate, GameUpdate

class GameService:
    def __init__(self, db: Session):
        self.db = db

    def create_game(self, game: GameCreate) -> Game:
        db_game = Game(**game.dict())
        self.db.add(db_game)
        self.db.commit()
        self.db.refresh(db_game)
        return db_game

    def get_game(self, game_id: int) -> Game:
        return self.db.query(Game).filter(Game.id == game_id).first()

    def update_game(self, game_id: int, game: GameUpdate) -> Game:
        db_game = self.get_game(game_id)
        if db_game:
            for key, value in game.dict(exclude_unset=True).items():
                setattr(db_game, key, value)
            self.db.commit()
            self.db.refresh(db_game)
        return db_game

    def delete_game(self, game_id: int) -> bool:
        db_game = self.get_game(game_id)
        if db_game:
            self.db.delete(db_game)
            self.db.commit()
            return True
        return False

    def list_games(self) -> list[Game]:
        return self.db.query(Game).all()