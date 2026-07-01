from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "HealthCopilot AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "supersecretkey_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days

    DATABASE_URL: str = "sqlite+aiosqlite:///./healthcopilot.db"

    # Kaggle credentials for dataset downloads
    KAGGLE_USERNAME: str = ""
    KAGGLE_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
