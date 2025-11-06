"""
RabbitMQ consumer worker for indexing threads into vector database.
"""

import asyncio
import json
import logging
from typing import Optional

import aio_pika

from src.config.settings import settings
from src.vector.qdrant_adapter import QdrantAdapter
from src.embeddings.openai_embeddings import OpenAIEmbeddings
from src.utils.community_client import CommunityClient

logger = logging.getLogger(__name__)


class IndexingWorker:
    """Worker for consuming thread indexing messages from RabbitMQ."""
    
    def __init__(self):
        """Initialize indexing worker."""
        self.connection: Optional[aio_pika.Connection] = None
        self.channel: Optional[aio_pika.Channel] = None
        self.queue: Optional[aio_pika.Queue] = None
        self.running = False
        
        # Initialize components
        self.vector_store = QdrantAdapter()
        self.embeddings = OpenAIEmbeddings()
        self.community_client = CommunityClient()
    
    async def start(self) -> None:
        """Start the indexing worker."""
        try:
            logger.info("Starting indexing worker...")
            
            # Initialize vector store
            await self.vector_store.initialize()
            
            # Connect to RabbitMQ
            self.connection = await aio_pika.connect_robust(
                settings.rabbitmq_url
            )
            self.channel = await self.connection.channel()
            
            # Declare queue
            self.queue = await self.channel.declare_queue(
                "indexing.threads",
                durable=True
            )
            
            # Start consuming
            await self.queue.consume(self.process_message)
            
            self.running = True
            logger.info("Worker started, waiting for messages...")
        except Exception as e:
            logger.error(f"Error starting worker: {e}", exc_info=True)
            raise
    
    async def process_message(
        self,
        message: aio_pika.IncomingMessage
    ) -> None:
        """
        Process incoming indexing message.
        
        Args:
            message: RabbitMQ message
        """
        async with message.process():
            try:
                # Parse message
                data = json.loads(message.body.decode())
                message_type = data.get("type")
                thread_id = data.get("threadId")
                
                logger.info(f"Received message: type={message_type}, thread_id={thread_id}")
                
                if message_type == "thread" or message_type == "post":
                    # Index or re-index thread
                    await self.index_thread(thread_id)
                else:
                    logger.warning(f"Unknown message type: {message_type}")
            except Exception as e:
                logger.error(f"Error processing message: {e}", exc_info=True)
    
    async def index_thread(self, thread_id: str) -> None:
        """
        Index a thread into the vector store.
        
        Args:
            thread_id: ID of thread to index
        """
        try:
            # Fetch thread from Community Service
            thread = await self.community_client.get_thread(thread_id)
            
            # Build content for embedding
            title = thread.get("title", "")
            body = thread.get("content", "")
            content = f"{title}\n\n{body}"
            
            # Generate embedding
            logger.info(f"Generating embedding for thread {thread_id}")
            embedding = await self.embeddings.embed_text(content)
            
            # Prepare metadata
            metadata = {
                "thread_id": thread_id,
                "title": title,
                "excerpt": body[:200],
                "tags": thread.get("tags", []),
                "created_at": thread.get("created_at", "")
            }
            
            # Index in vector store
            logger.info(f"Indexing thread {thread_id} in vector store")
            await self.vector_store.index(
                id=thread_id,
                vector=embedding,
                metadata=metadata
            )
            
            logger.info(f"Successfully indexed thread {thread_id}")
        except Exception as e:
            logger.error(f"Error indexing thread {thread_id}: {e}", exc_info=True)
    
    async def stop(self) -> None:
        """Stop the indexing worker."""
        try:
            logger.info("Stopping indexing worker...")
            
            self.running = False
            
            # Close RabbitMQ connection
            if self.channel:
                await self.channel.close()
            if self.connection:
                await self.connection.close()
            
            # Close community client
            await self.community_client.close()
            
            logger.info("Worker stopped successfully")
        except Exception as e:
            logger.error(f"Error stopping worker: {e}", exc_info=True)
