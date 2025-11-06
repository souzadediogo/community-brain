# Community Brain Assistant Service

AI-powered assistant service for the Community Brain Q&A platform. Built with FastAPI, LangChain, Qdrant, and OpenAI.

## Features

- **RAG (Retrieval-Augmented Generation)**: Answer questions using semantic search over community threads
- **Thread Summarization**: Generate structured summaries of discussions
- **Expert Recommendations**: Find relevant experts based on tags and expertise
- **Semantic Search**: Find similar threads using vector similarity
- **Real-time Indexing**: Automatically index new threads via RabbitMQ

## Tech Stack

- **Framework**: FastAPI (Python 3.11)
- **AI/ML**: LangChain, OpenAI (embeddings + generation)
- **Vector Database**: Qdrant
- **Message Queue**: RabbitMQ
- **HTTP Client**: httpx (async)

## Architecture

```
RabbitMQ Queue
    ↓ (indexing worker)
Assistant Service (Port 5000)
    ├─→ LangChain (orchestration)
    ├─→ Qdrant (vector storage)
    ├─→ OpenAI (embeddings + generation)
    └─→ Community Service (HTTP client)
```

## Setup

### Prerequisites

- Python 3.11+
- OpenAI API key
- Qdrant vector database
- RabbitMQ message broker
- Community Service running

### Installation

1. Create virtual environment:
```bash
python3.11 -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API keys and service URLs
```

### Required Environment Variables

```bash
# Server
ENVIRONMENT=development
PORT=5000

# OpenAI
OPENAI_API_KEY=sk-your-api-key
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_LLM_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=threads

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672/

# Community Service
COMMUNITY_SERVICE_URL=http://localhost:4001
```

## Running the Service

### Development

```bash
python -m uvicorn src.main:app --reload --port 5000
```

### Production

```bash
python -m uvicorn src.main:app --host 0.0.0.0 --port 5000
```

### Docker

```bash
# Build image
docker build -t assistant-service .

# Run container
docker run -p 5000:5000 --env-file .env assistant-service
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Ask Question (RAG)
```bash
POST /api/ask
{
  "question": "How do I deploy to production?",
  "context_thread_id": "optional-thread-id",
  "top_k": 5
}
```

### Summarize Thread
```bash
POST /api/summarize
{
  "thread_id": "thread-uuid"
}
```

### Find Experts
```bash
POST /api/experts
{
  "tags": ["python", "fastapi"],
  "top_k": 5
}
```

### Find Similar Threads
```bash
POST /api/similar
{
  "query": "deployment best practices",
  "top_k": 5
}
```

## Testing

Run tests:
```bash
pytest tests/
```

Run with coverage:
```bash
pytest --cov=src --cov-report=html tests/
```

## Project Structure

```
assistant/
├── src/
│   ├── main.py                    # FastAPI app entry point
│   ├── config/
│   │   └── settings.py            # Configuration
│   ├── api/
│   │   ├── routes.py              # API endpoints
│   │   └── schemas.py             # Request/response models
│   ├── core/
│   │   ├── orchestrator.py        # Abstract LLM interface
│   │   └── langchain_adapter.py   # LangChain implementation
│   ├── vector/
│   │   ├── vector_store.py        # Abstract vector store
│   │   └── qdrant_adapter.py      # Qdrant implementation
│   ├── embeddings/
│   │   ├── embedding_service.py   # Abstract embedding service
│   │   └── openai_embeddings.py   # OpenAI implementation
│   ├── services/
│   │   ├── rag_service.py         # RAG pipeline
│   │   ├── summarization_service.py
│   │   ├── expert_service.py
│   │   └── search_service.py
│   ├── workers/
│   │   └── indexing_worker.py     # RabbitMQ consumer
│   └── utils/
│       └── community_client.py    # HTTP client
├── tests/
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Development

### Code Style

- Follow PEP 8
- Use Black for formatting: `black src/`
- Use isort for imports: `isort src/`
- Type hints required

### Adding New Features

1. Update abstract interfaces first
2. Implement concrete adapters
3. Add service logic
4. Create API endpoints
5. Write tests
6. Update documentation

## Troubleshooting

### Service won't start
- Check all environment variables are set
- Verify Qdrant is running and accessible
- Verify RabbitMQ is running
- Check Community Service is available

### Embeddings failing
- Verify OPENAI_API_KEY is valid
- Check API quota and billing
- Verify model name is correct

### Indexing worker not consuming
- Verify RabbitMQ connection
- Check queue exists: "indexing.threads"
- Verify Community Service is accessible
- Check worker logs for errors

## License

MIT
