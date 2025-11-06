"""
Application settings and configuration.

Loads configuration from environment variables using pydantic-settings.
"""

from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Server Configuration
    environment: Literal["development", "production"] = Field(
        default="development",
        description="Application environment"
    )
    port: int = Field(
        default=5000,
        ge=1,
        le=65535,
        description="Server port"
    )

    # OpenAI Configuration
    openai_api_key: str = Field(
        description="OpenAI API key for embeddings and generation"
    )
    openai_embedding_model: str = Field(
        default="text-embedding-3-small",
        description="OpenAI embedding model"
    )
    openai_llm_model: str = Field(
        default="gpt-4",
        description="OpenAI LLM model for text generation"
    )
    openai_temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="Temperature for LLM generation"
    )

    # Qdrant Configuration
    qdrant_url: str = Field(
        default="http://localhost:6333",
        description="Qdrant vector database URL"
    )
    qdrant_collection_name: str = Field(
        default="threads",
        description="Qdrant collection name for thread vectors"
    )

    # RabbitMQ Configuration
    rabbitmq_url: str = Field(
        default="amqp://guest:guest@localhost:5672/",
        description="RabbitMQ connection URL"
    )

    # Community Service Configuration
    community_service_url: str = Field(
        default="http://localhost:4001",
        description="Community service base URL"
    )

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment == "production"


# Singleton settings instance
settings = Settings()
