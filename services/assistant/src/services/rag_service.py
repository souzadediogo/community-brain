"""
RAG (Retrieval-Augmented Generation) service implementation.
"""

import logging
from typing import List

from src.api.schemas import AskRequest, AskResponse, SourceThread
from src.core.orchestrator import Orchestrator
from src.vector.vector_store import VectorStore
from src.embeddings.embedding_service import EmbeddingService
from src.utils.community_client import CommunityClient

logger = logging.getLogger(__name__)


class RAGService:
    """RAG service for question answering."""
    
    def __init__(
        self,
        orchestrator: Orchestrator,
        vector_store: VectorStore,
        embeddings: EmbeddingService,
        community_client: CommunityClient
    ):
        """
        Initialize RAG service.
        
        Args:
            orchestrator: LLM orchestrator
            vector_store: Vector database
            embeddings: Embedding service
            community_client: Community service client
        """
        self.orchestrator = orchestrator
        self.vector_store = vector_store
        self.embeddings = embeddings
        self.community_client = community_client
    
    async def ask(self, request: AskRequest) -> AskResponse:
        """
        Answer a question using RAG.
        
        Args:
            request: Ask request with question and parameters
            
        Returns:
            Answer response with sources and confidence
        """
        try:
            # Step 1: Generate query embedding
            logger.info(f"Generating embedding for query: {request.question[:50]}...")
            query_embedding = await self.embeddings.embed_text(request.question)
            
            # Step 2: Search vector store
            logger.info(f"Searching for {request.top_k} similar threads")
            search_results = await self.vector_store.search(
                query_vector=query_embedding,
                top_k=request.top_k
            )
            
            if not search_results:
                logger.warning("No search results found")
                return AskResponse(
                    answer="I couldn't find any relevant information in the knowledge base to answer your question.",
                    sources=[],
                    confidence=0.0
                )
            
            # Step 3: Fetch full threads from Community Service
            thread_ids = [result.id for result in search_results]
            logger.info(f"Fetching {len(thread_ids)} threads from Community Service")
            threads = await self.community_client.get_threads_batch(thread_ids)
            
            # Step 4: Build context documents
            context_docs = []
            for thread in threads:
                context_docs.append({
                    "title": thread.get("title", ""),
                    "content": thread.get("content", ""),
                    "thread_id": thread.get("id", "")
                })
            
            # Step 5: Generate answer
            logger.info("Generating answer with LLM")
            answer_result = await self.orchestrator.answer_question(
                question=request.question,
                context_docs=context_docs
            )
            
            # Step 6: Build response
            sources = []
            for result in search_results:
                metadata = result.metadata
                sources.append(SourceThread(
                    thread_id=result.id,
                    title=metadata.get("title", "Untitled"),
                    relevance_score=result.score,
                    excerpt=metadata.get("excerpt", "")[:200]
                ))
            
            # Calculate confidence (average of top 3 scores)
            top_scores = [r.score for r in search_results[:3]]
            confidence = sum(top_scores) / len(top_scores) if top_scores else 0.0
            
            return AskResponse(
                answer=answer_result["answer"],
                sources=sources,
                confidence=round(confidence, 2)
            )
        except Exception as e:
            logger.error(f"Error in RAG service: {e}", exc_info=True)
            raise
