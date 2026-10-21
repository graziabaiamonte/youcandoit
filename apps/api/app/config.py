from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://ycdi:ycdi@db:5432/ycdi"
    content_dir: Path = Path("/content")
    roadmap_path: Path = Path("/roadmap/ROADMAP.md")
    timezone: str = "Europe/Rome"

    # "ollama" | "anthropic" | "fake". Empty = anthropic if a key is set, else ollama.
    llm_provider: str = ""
    ollama_url: str = "http://ollama:11434"
    ollama_chat_model: str = "llama3.2:3b"
    ollama_embed_model: str = "nomic-embed-text"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-opus-5-5"

    embed_dim: int = 768  # nomic-embed-text output size
    scheduler_enabled: bool = True
    cors_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
