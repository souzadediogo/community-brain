# Community Brain

AI-powered community platform, featuring RAG, semantic search, and intelligent assistant capabilities.

## Project Overview

Community Brain is a modern Q&A community platform that combines traditional forum functionality with advanced AI capabilities. Users can:

- Post questions and discussions as threads
- Reply to threads with insights
- Get AI-generated answers from the Braintrust assistant
- Discover similar threads via semantic search
- Find recommended experts based on topics
- View AI-generated thread summaries

## Architecture

This is a **microservices monorepo** with polyglot implementation:

```
community-brain/
├── frontend/                # Next.js 14 (TypeScript) - Web UI
├── services/
│   ├── api-gateway/        # Node.js/Express - Request routing, auth
│   ├── community/          # Node.js/Express - Thread/post CRUD, users
│   ├── assistant/          # Python/FastAPI - AI operations (RAG, search)
│   └── evaluation/         # Python/FastAPI - Benchmarking & metrics
├── infrastructure/
│   └── docker/             # Docker compose files
├── db/
│   ├── migrations/         # Database schema migrations
│   └── seeds/              # Seed data for development
├── scripts/                # Utility scripts
├── docs/                   # Documentation
└── tests/                  # Cross-service tests
    ├── e2e/               # End-to-end tests
    └── integration/       # Integration tests
```

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Query** for data fetching
- **Zod** for validation

### Backend Services

**API Gateway** (Node.js/Express)
- Request routing
- Authentication middleware
- Rate limiting

**Community Service** (Node.js/Express)
- Thread/post CRUD operations
- User management
- PostgreSQL with Prisma ORM

**Assistant Service** (Python/FastAPI)
- Question answering (RAG)
- Thread summarization
- Expert recommendations
- Semantic search
- LangChain/LlamaIndex/Haystack adapters

**Evaluation Service** (Python/FastAPI)
- Benchmarking system
- Quality evaluation
- Performance metrics
- Comparison reports

### Infrastructure
- **PostgreSQL 15** - Relational database
- **Qdrant** - Vector database for semantic search
- **RabbitMQ** - Message queue for async processing
- **Docker** - Containerization
- **Docker Compose** - Local development

### AI/ML Stack
- **Orchestrators:** LangChain (primary), LlamaIndex, Haystack, PromptSQL
- **LLM Providers:** OpenAI, Anthropic, Cohere, Mistral, Ollama
- **Vector Stores:** Qdrant (default), FAISS, Pinecone, Weaviate
- **Embeddings:** OpenAI text-embedding-3-small

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm/yarn**
- **Python** 3.11+
- **Docker** and **Docker Compose**
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/souzadediogo/community-brain.git
cd community-brain

# Copy environment variables
cp .env.example .env

# Start infrastructure services
docker-compose up -d postgres qdrant rabbitmq

# Install frontend dependencies
cd frontend
npm install

# Install service dependencies
cd ../services/assistant
pip install -r requirements.txt

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### Development

```bash
# Start all services with Docker Compose
docker-compose up

# Or run services individually:

# Frontend (Next.js)
cd frontend && npm run dev

# API Gateway
cd services/api-gateway && npm run dev

# Community Service
cd services/community && npm run dev

# Assistant Service
cd services/assistant && uvicorn main:app --reload

# Evaluation Service
cd services/evaluation && uvicorn main:app --reload --port 5001
```

Access the application:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:4000
- Community Service: http://localhost:4001
- Assistant Service: http://localhost:5000
- Evaluation Service: http://localhost:5001

## Features

### Phase 1: Core MVP ✅
- [x] Thread creation & management
- [x] Post replies & discussions
- [x] User profiles & expertise
- [x] Question answering (RAG)
- [x] Semantic search
- [x] Thread summarization
- [x] Expert recommendations

### Phase 2: Evaluation & Optimization 🚧
- [ ] Benchmarking system
- [ ] Quality evaluation (LLM-as-judge)
- [ ] Performance metrics
- [ ] Comparison dashboard
- [ ] Cost tracking

### Phase 3: Advanced Features 📋
- [ ] Reranking for improved search quality
- [ ] Streaming responses
- [ ] Multi-language support
- [ ] Slack bot integration

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Development Guide](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## Project Goals

1. **Recreate Braintrust's intelligent assistant behavior** in a functional prototype
2. **Simulate a realistic executive Q&A community** to support end-to-end user flow
3. **Explore and compare different AI stacks** (LLM, retrieval, orchestration)
4. **Build a plug-and-play system** for experimentation and benchmarking
5. **Showcase expertise** with Python, Node.js, Next.js, and modern AI tooling

## License

MIT License - see [LICENSE](./LICENSE) for details

## Contact

**Diogo de Souza**
- GitHub: [@souzadediogo](https://github.com/souzadediogo)
- Email: hello@diogodesouza.com

---

Built with ❤️ using Next.js, FastAPI, and modern AI technologies
