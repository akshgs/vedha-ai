from typing import List, Optional

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Vedha AI"
    APP_VERSION: str = "3.0.0"

    API_PREFIX: str = "/api/v1"

    # PostgreSQL environment variables for dynamic composition
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_HOST: Optional[str] = None
    POSTGRES_PORT: Optional[str] = "5432"
    POSTGRES_DB: Optional[str] = None

    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str = "vedha-ai-super-secret-key-2026"
    GROQ_API_KEY: Optional[str] = ""

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    ALLOWED_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "*",
        ]
    )

    @model_validator(mode="after")
    def assemble_db_connection(self) -> "Settings":
        # 1. If DATABASE_URL is explicitly set, use it directly
        if self.DATABASE_URL and self.DATABASE_URL.strip():
            # Fix legacy postgres:// URL scheme (from Render/Heroku PostgreSQL services)
            if self.DATABASE_URL.startswith("postgres://"):
                self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
            return self

        # 2. Assemble PostgreSQL URL from individual components if present
        if self.POSTGRES_USER and self.POSTGRES_PASSWORD and self.POSTGRES_HOST and self.POSTGRES_DB:
            port = self.POSTGRES_PORT or "5432"
            self.DATABASE_URL = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{port}/{self.POSTGRES_DB}"
            return self

        # 3. Fallback to local SQLite database for development/single-container deployment
        self.DATABASE_URL = "sqlite:///./vedha_ai.db"
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()