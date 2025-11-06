"""
Semantic search service for finding similar threads.
"""

import logging

from src.api.schemas import SimilarThreadsRequest, SimilarThreadsResponse, SimilarThread
from src.vector.vector_store import VectorStore
from src.embeddings.embedding_service import EmbeddingService
from src.utils.community_client import CommunityClient

logger = logging.getLogger(__name__)


class SearchService:
    """Service for semantic search."""
    
    def __init__(
        self,
        vector_store: VectorStore,
        embeddings: EmbeddingService,
        community_client: CommunityClient
    ):
        """
        Initialize search service.
        
        Args:
            vector_store: Vector database
            embeddings: Embedding service
            community_client: Community service client
        """
        self.vector_store = vector_store
        self.embeddings = embeddings
        self.community_client = community_client
    
    async def find_similar(
        self,
        request: SimilarThreadsRequest
    ) -> SimilarThreadsResponse:
        """
        Find similar threads.
        
        Args:
            request: Search request
            
        Returns:
            Similar threads response
        """
        try:
            logger.info(f"Searching for similar threads: {request.query[:50]}...")
            
            # Generate query embedding
            query_embedding = await self.embeddings.embed_text(request.query)
            
            # Search vector store
            search_results = await self.vector_store.search(
                query_vector=query_embedding,
                top_k=request.top_k
            )
            
            # Map to SimilarThread models
            threads = []
            for result in search_results:
                metadata = result.metadata
                threads.append(SimilarThread(
                    thread_id=result.id,
                    title=metadata.get("title", "Untitled"),
                    similarity_score=result.score,
                    tags=metadata.get("tags", []),
                    created_at=metadata.get("created_at", "")
                ))
            
            return SimilarThreadsResponse(threads=threads)
        except Exception as e:
            logger.error(f"Error in search service: {e}", exc_info=True)
            raise
