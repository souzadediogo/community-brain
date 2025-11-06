"""
API routes using shared generated types from OpenAPI spec.

This module demonstrates integration with brain_shared.generated types
for type-safe communication with other services.
"""

import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException, status

# Import shared generated types
# Note: Due to pydantic v1/v2 compatibility issues, we import directly from model files
from brain_shared.generated.brain_shared.generated.models.thread import Thread
from brain_shared.generated.brain_shared.generated.models.post import Post
from brain_shared.generated.brain_shared.generated.models.create_thread_dto import CreateThreadDto
from brain_shared.generated.brain_shared.generated.models.create_post_dto import CreatePostDto
from brain_shared.generated.brain_shared.generated.models.thread_status import ThreadStatus
from brain_shared.generated.brain_shared.generated.models.user import User

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/shared-types", tags=["Shared Types Demo"])


@router.get(
    "/thread-example",
    response_model=dict,  # Using dict for now due to pydantic v1/v2 issues
    summary="Example Thread Using Shared Types",
    description="Demonstrates creating a Thread object using shared generated types"
)
async def get_example_thread():
    """
    Get an example thread using shared Thread type.

    This endpoint demonstrates how to use the generated Thread model
    from brain_shared.generated for consistent typing across services.
    """
    try:
        # Create example user first
        example_user = User(
            id="user-123",
            username="john_doe",
            email="john@example.com"
        )

        # Create example thread using shared type
        example_thread = Thread(
            id="thread-123",
            title="Example Thread Using Shared Types",
            content="This is a demonstration of using OpenAPI-generated types in the Assistant service.",
            author=example_user,
            tags=["example", "openapi", "shared-types"],
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
            postCount=5,
            viewCount=42,
            hasAiResponse=True,
            status=ThreadStatus.OPEN
        )

        # Convert to dict for response (bypassing pydantic v1/v2 issues)
        return {
            "message": "Successfully created Thread using shared types",
            "thread": example_thread.to_dict(),
            "type_info": {
                "model": Thread.__name__,
                "module": Thread.__module__,
                "fields": list(example_thread.__dict__.keys())
            }
        }
    except Exception as e:
        logger.error(f"Error creating example thread: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create example: {str(e)}"
        )


@router.get(
    "/post-example",
    response_model=dict,
    summary="Example Post Using Shared Types",
    description="Demonstrates creating a Post object using shared generated types"
)
async def get_example_post():
    """
    Get an example post using shared Post type.
    """
    try:
        # Create example user
        example_user = User(
            id="user-456",
            username="jane_smith",
            email="jane@example.com"
        )

        # Create example post using shared type
        example_post = Post(
            id="post-789",
            threadId="thread-123",
            content="This is an example post demonstrating shared types integration.",
            author=example_user,
            createdAt=datetime.now(),
            isAiResponse=True,
            upvotes=15,
            isAcceptedAnswer=False
        )

        return {
            "message": "Successfully created Post using shared types",
            "post": example_post.to_dict(),
            "type_info": {
                "model": Post.__name__,
                "module": Post.__module__,
                "fields": list(example_post.__dict__.keys())
            }
        }
    except Exception as e:
        logger.error(f"Error creating example post: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create example: {str(e)}"
        )


@router.post(
    "/validate-thread-dto",
    response_model=dict,
    summary="Validate CreateThreadDto",
    description="Validates a CreateThreadDto using shared generated types"
)
async def validate_thread_dto(dto: dict):
    """
    Validate a thread creation DTO using shared type.

    This demonstrates Pydantic validation with shared types.
    Request body should match CreateThreadDto schema.
    """
    try:
        # Validate using shared type
        validated_dto = CreateThreadDto(
            title=dto.get("title"),
            content=dto.get("content"),
            tags=dto.get("tags", [])
        )

        return {
            "message": "DTO validated successfully",
            "validated_data": validated_dto.to_dict(),
            "validation_info": {
                "model": CreateThreadDto.__name__,
                "title_length": len(validated_dto.title),
                "content_length": len(validated_dto.content),
                "tags_count": len(validated_dto.tags)
            }
        }
    except Exception as e:
        logger.error(f"Validation error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation failed: {str(e)}"
        )


@router.get(
    "/type-info",
    response_model=dict,
    summary="Shared Types Information",
    description="Get information about available shared types"
)
async def get_type_info():
    """
    Get information about shared generated types.

    Lists all the shared types being used and their sources.
    """
    return {
        "message": "Shared types integration active",
        "shared_types": {
            "models": [
                {"name": "Thread", "module": Thread.__module__},
                {"name": "Post", "module": Post.__module__},
                {"name": "User", "module": User.__module__},
                {"name": "ThreadStatus", "module": ThreadStatus.__module__}
            ],
            "dtos": [
                {"name": "CreateThreadDto", "module": CreateThreadDto.__module__},
                {"name": "CreatePostDto", "module": CreatePostDto.__module__}
            ]
        },
        "source": "brain_shared.generated (OpenAPI-generated)",
        "openapi_version": "0.1.0",
        "notes": [
            "Types are auto-generated from shared/api-spec/openapi.yaml",
            "Regenerate types by running: cd ../../shared && npm run generate:py",
            "All services use the same type definitions for consistency"
        ]
    }
