import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LLM provider config
    llm_api_key: str = ""
    llm_base_url: str = "https://api.openai.com/v1"
    llm_model: str = "gpt-4o-mini"

    # App config
    app_name: str = "AI Council"
    app_version: str = "1.0.0"
    debug: bool = False

    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Limits
    max_question_length: int = 2000
    request_timeout: int = 6

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def validate_llm_config(self) -> None:
        if not self.llm_api_key:
            raise ValueError(
                "LLM_API_KEY is not set. Please configure your .env file."
            )


def get_settings() -> Settings:
    return Settings()
