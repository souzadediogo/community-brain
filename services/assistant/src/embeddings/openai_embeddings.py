"""
OpenAI embeddings implementation.
"""

import logging
from typing import List

from openai import AsyncOpenAI

from src.embeddings.embedding_service import EmbeddingService
from src.config.settings import settings

logger = logging.getLogger(__name__)


class OpenAIEmbeddings(EmbeddingService):
    """OpenAI embeddings service."""
    
    def __init__(self):
        """Initialize OpenAI client."""
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_embedding_model
    
    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single text using OpenAI."""
        try:
            response = await self.client.embeddings.create(
                model=self.model,
                input=text
            )
            embedding = response.data[0].embedding
            logger.debug(f"Generated embedding of size {len(embedding)}")
            return embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts using OpenAI."""
        try:
            response = await self.client.embeddings.create(
                model=self.model,
                input=texts
            )
            embeddings = [item.embedding for item in response.data]
            logger.debug(f"Generated {len(embeddings)} embeddings")
            return embeddings
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {e}")
            raise
