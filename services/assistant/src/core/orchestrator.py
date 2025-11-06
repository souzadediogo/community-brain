"""
Abstract orchestrator interface for LLM operations.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List


class Orchestrator(ABC):
    """Abstract base class for LLM orchestration."""
    
    @abstractmethod
    async def answer_question(
        self,
        question: str,
        context_docs: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Answer a question using context documents.
        
        Args:
            question: User's question
            context_docs: List of context documents
            
        Returns:
            Dict with answer and metadata
        """
        pass
    
    @abstractmethod
    async def summarize(self, thread_content: str) -> Dict[str, Any]:
        """
        Summarize thread content.
        
        Args:
            thread_content: Full thread content
            
        Returns:
            Dict with summary components
        """
        pass
