from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    DATABASE_URL: str
    TELEGRAM_BOT_TOKEN: str
    MANAGER_CHAT_ID: int
    DEBUG: bool = False
    FRONTEND_URL: str = "https://surfjw.surf"
    FRONTEND_DEV_URL: str = "http://localhost:5173"


settings = Settings()
