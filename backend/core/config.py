from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from .env file."""

    DB_URL: str = "mysql+pymysql://root:password@localhost:3306/recruitment_db"
    APP_NAME: str = "RecruitPro"
    DEBUG: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
