"""
API routes for the Assistant Service.
"""

import logging
from fastapi import APIRouter, HTTPException, status

from src.api.schemas import (
    AskRequest,
    AskResponse,
    SummarizeRequest,
    SummarizeResponse,
    ExpertRequest,
    ExpertResponse,
    SimilarThreadsRequest,
    SimilarThreadsResponse,
)
from src.services.rag_service import RAGService
from src.services.summarization_service import SummarizationService
from src.services.expert_service import ExpertService
from src.services.search_service import SearchService
from src.core.langchain_adapter import LangChainAdapter
from src.vector.qdrant_adapter import QdrantAdapter
from src.embeddings.openai_embeddings import OpenAIEmbeddings
from src.utils.community_client import CommunityClient

# Import shared types routes
from src.api.shared_types_routes import router as shared_types_router

logger = logging.getLogger(__name__)

# Create main router
router = APIRouter()

# Include shared types demo routes
router.include_router(shared_types_router)

# Initialize components (singleton pattern for MVP)
orchestrator = LangChainAdapter()
vector_store = QdrantAdapter()
embeddings = OpenAIEmbeddings()
community_client = CommunityClient()

# Initialize services
rag_service = RAGService(
    orchestrator=orchestrator,
    vector_store=vector_store,
    embeddings=embeddings,
    community_client=community_client
)

summarization_service = SummarizationService(
    orchestrator=orchestrator,
    community_client=community_client
)

expert_service = ExpertService(
    community_client=community_client
)

search_service = SearchService(
    vector_store=vector_store,
    embeddings=embeddings,
    community_client=community_client
)


@router.post(
    "/ask",
    response_model=AskResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask the AI Assistant",
    description="Query the assistant with a question and receive an AI-generated answer with sources",
)
async def ask_question(request: AskRequest) -> AskResponse:
    """
    Ask the Community Brain assistant a question.
    
    Uses RAG (Retrieval-Augmented Generation) to provide accurate answers
    based on indexed community threads.
    """
    try:
        return await rag_service.ask(request)
    except Exception as e:
        logger.error(f"Error in ask endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process question: {str(e)}"
        )


@router.post(
    "/summarize",
    response_model=SummarizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Summarize a Thread",
    description="Generate a structured summary of a discussion thread",
)
async def summarize_thread(request: SummarizeRequest) -> SummarizeResponse:
    """
    Summarize a discussion thread.
    
    Provides an executive summary, key points, consensus, and open questions.
    """
    try:
        return await summarization_service.summarize(request)
    except Exception as e:
        logger.error(f"Error in summarize endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to summarize thread: {str(e)}"
        )


@router.post(
    "/experts",
    response_model=ExpertResponse,
    status_code=status.HTTP_200_OK,
    summary="Find Experts",
    description="Find community experts by tags and expertise",
)
async def find_experts(request: ExpertRequest) -> ExpertResponse:
    """
    Find relevant experts based on tags.
    
    Returns a list of users with expertise in the specified topics.
    """
    try:
        return await expert_service.find_experts(request)
    except Exception as e:
        logger.error(f"Error in experts endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to find experts: {str(e)}"
        )


@router.post(
    "/similar",
    response_model=SimilarThreadsResponse,
    status_code=status.HTTP_200_OK,
    summary="Find Similar Threads",
    description="Find semantically similar discussion threads",
)
async def find_similar_threads(
    request: SimilarThreadsRequest
) -> SimilarThreadsResponse:
    """
    Find similar threads using semantic search.
    
    Returns threads that are semantically related to the search query.
    """
    try:
        return await search_service.find_similar(request)
    except Exception as e:
        logger.error(f"Error in similar endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to find similar threads: {str(e)}"
        )
