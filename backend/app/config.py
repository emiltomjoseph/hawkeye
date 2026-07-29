"""
Application configuration using pydantic-settings.
Loads environment variables from .env file with type validation.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Database
    database_url: str = "sqlite+aiosqlite:///./hawkeye.db"

    # JWT
    secret_key: str = "hawkeye-super-secret-key-change-in-production-2024"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # App
    app_name: str = "HawkEye"
    app_version: str = "1.0.0"
    debug: bool = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings singleton."""
    return Settings()
