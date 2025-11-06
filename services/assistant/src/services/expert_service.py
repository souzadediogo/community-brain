"""
Expert recommendation service.
"""

import logging
from typing import List

from src.api.schemas import ExpertRequest, ExpertResponse, Expert
from src.utils.community_client import CommunityClient

logger = logging.getLogger(__name__)


class ExpertService:
    """Service for finding expert recommendations."""
    
    def __init__(self, community_client: CommunityClient):
        """
        Initialize expert service.
        
        Args:
            community_client: Community service client
        """
        self.community_client = community_client
    
    async def find_experts(self, request: ExpertRequest) -> ExpertResponse:
        """
        Find experts by tags.
        
        Args:
            request: Expert request with tags
            
        Returns:
            Expert response
        """
        try:
            logger.info(f"Finding experts for tags: {request.tags}")
            
            # Call community service to get experts
            experts_data = await self.community_client.get_experts_by_tags(
                tags=request.tags,
                top_k=request.top_k
            )
            
            # Map to Expert models
            experts: List[Expert] = []
            for expert_data in experts_data:
                experts.append(Expert(
                    user_id=expert_data.get("user_id", ""),
                    username=expert_data.get("username", ""),
                    expertise_score=expert_data.get("expertise_score", 0.0),
                    relevant_contributions=expert_data.get("relevant_contributions", 0)
                ))
            
            return ExpertResponse(experts=experts)
        except Exception as e:
            logger.error(f"Error in expert service: {e}", exc_info=True)
            raise
