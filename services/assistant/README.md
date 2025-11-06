# Assistant Service

Python/FastAPI service for AI operations including RAG, search, and recommendations.

## Responsibilities
- Question answering (RAG)
- Thread summarization
- Expert recommendations
- Semantic search
- Vector operations with Qdrant

## Tech Stack
- Python 3.11+
- FastAPI
- LangChain (primary orchestrator)
- LlamaIndex, Haystack (alternatives)
- Qdrant client
- OpenAI, Anthropic, Cohere SDKs

## Adapters
- **Orchestrators:** LangChain, LlamaIndex, Haystack, PromptSQL
- **LLM Providers:** OpenAI, Anthropic, Cohere, Mistral, Ollama
- **Vector Stores:** Qdrant, FAISS, Pinecone, Weaviate
