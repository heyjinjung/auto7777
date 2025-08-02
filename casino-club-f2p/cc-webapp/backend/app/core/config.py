from pydantic import BaseSettings

class Settings(BaseSettings):
    # General application settings
    APP_NAME: str = "Casino-Club F2P"
    APP_VERSION: str = "1.0.0"
    
    # Database settings
    DATABASE_URL: str
    DATABASE_TEST_URL: str
    
    # Redis settings
    REDIS_URL: str
    
    # JWT settings
    JWT_SECRET_KEY: str
    JWT_EXPIRATION: int = 60 * 24  # 1 day in minutes
    
    # Other settings
    ALLOWED_ORIGINS: list = []

    class Config:
        env_file = ".env.development"
        env_file_encoding = "utf-8"

settings = Settings()