import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    DATABASE_URL: Optional[str] = None
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    MANAGER_CHAT_ID: Optional[int] = None
    DEBUG: bool = False
    FRONTEND_URL: str = "https://surfjw.surf"
    FRONTEND_DEV_URL: str = "http://localhost:5173"

    def validate_required(self):
        """Validate that all required fields are set."""
        required_fields = ["DATABASE_URL", "TELEGRAM_BOT_TOKEN", "MANAGER_CHAT_ID"]
        missing_fields = [field for field in required_fields if getattr(self, field) is None]
        
        if missing_fields:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_fields)}")
        
        return True


settings = Settings()

# Validate on import for runtime safety
if any(getattr(settings, field) is None for field in ["DATABASE_URL", "TELEGRAM_BOT_TOKEN", "MANAGER_CHAT_ID"]):
    import warnings
    warnings.warn(
        "Some required environment variables are missing. "
        "Set them in .env file or environment variables.",
        UserWarning
    )
