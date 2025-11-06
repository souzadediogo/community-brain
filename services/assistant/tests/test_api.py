"""
Basic API tests for the Assistant Service.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "assistant"


@pytest.mark.asyncio
async def test_ask_validation():
    """Test ask endpoint input validation."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        # Test with short question (should fail validation)
        response = await client.post(
            "/api/ask",
            json={"question": "Hi", "top_k": 5}
        )
        assert response.status_code == 422  # Validation error
