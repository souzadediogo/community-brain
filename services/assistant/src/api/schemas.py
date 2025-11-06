"""
Pydantic request and response schemas for API endpoints.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


# Request Schemas

class AskRequest(BaseModel):
    """Request schema for asking the AI assistant."""

    question: str = Field(
        min_length=5,
        max_length=1000,
        description="User's question or query"
    )
    context_thread_id: Optional[str] = Field(
        default=None,
        description="Optional thread ID for context"
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of similar threads to retrieve"
    )


class SummarizeRequest(BaseModel):
    """Request schema for thread summarization."""

    thread_id: str = Field(
        description="ID of the thread to summarize"
    )


class ExpertRequest(BaseModel):
    """Request schema for expert recommendations."""

    tags: List[str] = Field(
        min_length=1,
        description="Tags to match experts against"
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of experts to return"
    )


class SimilarThreadsRequest(BaseModel):
    """Request schema for finding similar threads."""

    query: str = Field(
        min_length=5,
        description="Search query"
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of similar threads to return"
    )


# Response Schemas

class SourceThread(BaseModel):
    """Source thread information in response."""

    thread_id: str
    title: str
    relevance_score: float
    excerpt: str


class AskResponse(BaseModel):
    """Response schema for ask endpoint."""

    answer: str
    sources: List[SourceThread]
    confidence: float = Field(ge=0.0, le=1.0)


class SummarizeResponse(BaseModel):
    """Response schema for summarize endpoint."""

    summary: str
    key_points: List[str]
    consensus: Optional[str] = None
    open_questions: Optional[List[str]] = None


class Expert(BaseModel):
    """Expert information."""

    user_id: str
    username: str
    expertise_score: float = Field(ge=0.0, le=1.0)
    relevant_contributions: int


class ExpertResponse(BaseModel):
    """Response schema for experts endpoint."""

    experts: List[Expert]


class SimilarThread(BaseModel):
    """Similar thread information."""

    thread_id: str
    title: str
    similarity_score: float = Field(ge=0.0, le=1.0)
    tags: List[str]
    created_at: str


class SimilarThreadsResponse(BaseModel):
    """Response schema for similar threads endpoint."""

    threads: List[SimilarThread]
