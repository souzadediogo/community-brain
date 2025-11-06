"""
Qdrant adapter implementation for vector storage.
"""

import logging
from typing import Any, Dict, List, Optional

from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams, Filter, FieldCondition, MatchValue

from src.vector.vector_store import SearchResult, VectorStore
from src.config.settings import settings

logger = logging.getLogger(__name__)


class QdrantAdapter(VectorStore):
    """Qdrant vector database adapter."""
    
    def __init__(self):
        """Initialize Qdrant client."""
        self.client = AsyncQdrantClient(url=settings.qdrant_url)
        self.collection_name = settings.qdrant_collection_name
        self.vector_size = 1536  # OpenAI text-embedding-3-small dimension
    
    async def initialize(self) -> None:
        """Initialize Qdrant collection if it doesn't exist."""
        try:
            collections = await self.client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if self.collection_name not in collection_names:
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.vector_size,
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Qdrant collection already exists: {self.collection_name}")
        except Exception as e:
            logger.error(f"Error initializing Qdrant collection: {e}")
            raise
    
    async def index(
        self,
        id: str,
        vector: List[float],
        metadata: Dict[str, Any]
    ) -> None:
        """Index a vector in Qdrant."""
        try:
            point = PointStruct(
                id=id,
                vector=vector,
                payload=metadata
            )
            
            await self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )
            logger.debug(f"Indexed vector with ID: {id}")
        except Exception as e:
            logger.error(f"Error indexing vector {id}: {e}")
            raise
    
    async def search(
        self,
        query_vector: List[float],
        top_k: int = 5,
        filter_conditions: Optional[Dict[str, Any]] = None
    ) -> List[SearchResult]:
        """Search for similar vectors in Qdrant."""
        try:
            # Build filter if provided
            query_filter = None
            if filter_conditions:
                conditions = [
                    FieldCondition(key=key, match=MatchValue(value=value))
                    for key, value in filter_conditions.items()
                ]
                query_filter = Filter(must=conditions)
            
            # Perform search
            results = await self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k,
                query_filter=query_filter
            )
            
            # Convert to SearchResult objects
            search_results = [
                SearchResult(
                    id=str(point.id),
                    score=point.score,
                    metadata=point.payload or {}
                )
                for point in results
            ]
            
            logger.debug(f"Found {len(search_results)} similar vectors")
            return search_results
        except Exception as e:
            logger.error(f"Error searching vectors: {e}")
            return []
    
    async def delete(self, id: str) -> None:
        """Delete a vector from Qdrant."""
        try:
            await self.client.delete(
                collection_name=self.collection_name,
                points_selector=[id]
            )
            logger.debug(f"Deleted vector with ID: {id}")
        except Exception as e:
            logger.error(f"Error deleting vector {id}: {e}")
            raise
