"""
Abstract vector store interface for semantic search.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class SearchResult:
    """Search result from vector store."""
    
    id: str
    score: float
    metadata: Dict[str, Any]


class VectorStore(ABC):
    """Abstract base class for vector database operations."""
    
    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the vector store (create collections, etc.)."""
        pass
    
    @abstractmethod
    async def index(
        self,
        id: str,
        vector: List[float],
        metadata: Dict[str, Any]
    ) -> None:
        """Index a vector with metadata."""
        pass
    
    @abstractmethod
    async def search(
        self,
        query_vector: List[float],
        top_k: int = 5,
        filter_conditions: Optional[Dict[str, Any]] = None
    ) -> List[SearchResult]:
        """Search for similar vectors."""
        pass
    
    @abstractmethod
    async def delete(self, id: str) -> None:
        """Delete a vector by ID."""
        pass
