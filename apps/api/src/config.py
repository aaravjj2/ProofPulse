"""ProofPulse API configuration using pydantic-settings."""

from __future__ import annotations

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    openai_max_tokens: int = 1500
    openai_temperature: float = 0.2
    database_url: str = "sqlite+aiosqlite:///./proofpulse.db"
    cors_origins: list[str] = ["http://localhost:3000"]
    rate_limit_per_minute: int = 30
    max_image_size_mb: int = 10
    max_text_length: int = 10000
    log_level: str = "INFO"
    environment: str = "development"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
