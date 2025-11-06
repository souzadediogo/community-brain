"""
FastAPI application entry point for Community Brain Assistant Service.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config.settings import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.is_development else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global worker instance
indexing_worker = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """
    Manage application lifespan events.
    
    Handles startup and shutdown logic for the FastAPI application.
    """
    # Startup
    logger.info(f"Starting Braintrust Assistant Service in {settings.environment} mode")
    logger.info(f"Server will run on port {settings.port}")
    
    # Initialize and start indexing worker
    global indexing_worker
    from src.workers.indexing_worker import IndexingWorker
    
    indexing_worker = IndexingWorker()
    try:
        await indexing_worker.start()
        logger.info("Indexing worker started successfully")
    except Exception as e:
        logger.error(f"Failed to start indexing worker: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Braintrust Assistant Service")
    if indexing_worker:
        try:
            await indexing_worker.stop()
            logger.info("Indexing worker stopped successfully")
        except Exception as e:
            logger.error(f"Error stopping indexing worker: {e}")


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title="Braintrust Assistant Service",
        version="1.0.0",
        description="AI-powered assistant for Community Brain Q&A platform",
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        lifespan=lifespan,
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "service": "assistant",
            "version": "1.0.0"
        }
    
    # Include API routes
    from src.api.routes import router as api_router
    app.include_router(api_router, prefix="/api")
    
    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.is_development,
    )
