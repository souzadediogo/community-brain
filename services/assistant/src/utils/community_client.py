"""
HTTP client for communicating with Community Service.
"""

import logging
from typing import Any, Dict, List, Optional

import httpx

from src.config.settings import settings

logger = logging.getLogger(__name__)


class CommunityClient:
    """Async HTTP client for Community Service API."""
    
    def __init__(self):
        """Initialize HTTP client."""
        self.base_url = settings.community_service_url
        self.client: Optional[httpx.AsyncClient] = None
    
    async def __aenter__(self):
        """Async context manager entry."""
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.client:
            await self.client.aclose()
    
    async def get_thread(self, thread_id: str) -> Dict[str, Any]:
        """
        Fetch a single thread by ID.
        
        Args:
            thread_id: Thread ID
            
        Returns:
            Thread data
        """
        try:
            if not self.client:
                self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)
            
            response = await self.client.get(f"/api/threads/{thread_id}")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error fetching thread {thread_id}: {e}")
            raise
    
    async def get_threads_batch(self, thread_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Fetch multiple threads by IDs.
        
        Args:
            thread_ids: List of thread IDs
            
        Returns:
            List of thread data
        """
        threads = []
        for thread_id in thread_ids:
            try:
                thread = await self.get_thread(thread_id)
                threads.append(thread)
            except Exception as e:
                logger.warning(f"Failed to fetch thread {thread_id}: {e}")
                continue
        return threads
    
    async def get_thread_posts(self, thread_id: str) -> List[Dict[str, Any]]:
        """
        Fetch all posts in a thread.
        
        Args:
            thread_id: Thread ID
            
        Returns:
            List of posts
        """
        try:
            if not self.client:
                self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)
            
            response = await self.client.get(f"/api/threads/{thread_id}/posts")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error fetching posts for thread {thread_id}: {e}")
            return []
    
    async def get_experts_by_tags(
        self,
        tags: List[str],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get expert recommendations by tags.
        
        Args:
            tags: List of tags
            top_k: Number of experts to return
            
        Returns:
            List of experts
        """
        try:
            if not self.client:
                self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)
            
            params = {"tags": ",".join(tags), "limit": top_k}
            response = await self.client.get("/api/users/experts", params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error fetching experts: {e}")
            return []
    
    async def close(self) -> None:
        """Close HTTP client."""
        if self.client:
            await self.client.aclose()
