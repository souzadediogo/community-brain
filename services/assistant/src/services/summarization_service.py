"""
Thread summarization service.
"""

import logging

from src.api.schemas import SummarizeRequest, SummarizeResponse
from src.core.orchestrator import Orchestrator
from src.utils.community_client import CommunityClient

logger = logging.getLogger(__name__)


class SummarizationService:
    """Service for summarizing thread discussions."""
    
    def __init__(
        self,
        orchestrator: Orchestrator,
        community_client: CommunityClient
    ):
        """
        Initialize summarization service.
        
        Args:
            orchestrator: LLM orchestrator
            community_client: Community service client
        """
        self.orchestrator = orchestrator
        self.community_client = community_client
    
    async def summarize(self, request: SummarizeRequest) -> SummarizeResponse:
        """
        Summarize a thread.
        
        Args:
            request: Summarize request with thread ID
            
        Returns:
            Summary response
        """
        try:
            # Fetch thread
            logger.info(f"Fetching thread {request.thread_id}")
            thread = await self.community_client.get_thread(request.thread_id)
            
            # Fetch posts
            logger.info(f"Fetching posts for thread {request.thread_id}")
            posts = await self.community_client.get_thread_posts(request.thread_id)
            
            # Build full content
            content_parts = [
                f"Title: {thread.get('title', '')}",
                f"\nOriginal Post: {thread.get('content', '')}",
                "\nReplies:"
            ]
            
            for post in posts:
                author = post.get('author', 'Unknown')
                content = post.get('content', '')
                content_parts.append(f"\n- {author}: {content}")
            
            full_content = "\n".join(content_parts)
            
            # Generate summary
            logger.info("Generating summary with LLM")
            summary_result = await self.orchestrator.summarize(full_content)
            
            return SummarizeResponse(
                summary=summary_result.get("summary", ""),
                key_points=summary_result.get("key_points", []),
                consensus=summary_result.get("consensus"),
                open_questions=summary_result.get("open_questions")
            )
        except Exception as e:
            logger.error(f"Error in summarization service: {e}", exc_info=True)
            raise
