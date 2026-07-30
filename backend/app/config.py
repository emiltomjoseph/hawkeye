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

    # JWT — Access Token
    secret_key: str = "hawkeye-super-secret-key-change-in-production-2024"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # JWT — Refresh Token
    refresh_secret_key: str = "hawkeye-refresh-secret-key-change-in-production-2024"
    refresh_token_expire_days: int = 7

    # Password Policy
    password_min_length: int = 8
    password_require_uppercase: bool = True
    password_require_digit: bool = True

    # Rate Limiting
    rate_limit_auth: str = "10/minute"
    rate_limit_scan: str = "5/minute"
    rate_limit_default: str = "60/minute"

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # App
    app_name: str = "HawkEye"
    app_version: str = "1.0.0"
    debug: bool = True

    # Pagination
    default_page_size: int = 20
    max_page_size: int = 100


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings singleton."""
    return Settings()
