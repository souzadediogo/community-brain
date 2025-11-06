"""
LangChain adapter for LLM orchestration.
"""

import logging
import json
from typing import Any, Dict, List

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

from src.core.orchestrator import Orchestrator
from src.config.settings import settings

logger = logging.getLogger(__name__)


class LangChainAdapter(Orchestrator):
    """LangChain-based orchestrator implementation."""
    
    def __init__(self):
        """Initialize LangChain ChatOpenAI."""
        self.llm = ChatOpenAI(
            model=settings.openai_llm_model,
            temperature=settings.openai_temperature,
            openai_api_key=settings.openai_api_key
        )
    
    async def answer_question(
        self,
        question: str,
        context_docs: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Answer question using RAG with LangChain."""
        try:
            # Build context string
            context = self._build_context(context_docs)
            
            # Create prompt template
            system_prompt = """You are Braintrust AI, a helpful assistant for the Community Brain Q&A platform.

Use the following context from previous discussions to answer the question. If you don't know the answer based on the context, say so clearly - don't make up information.

CONTEXT:
{context}

Provide a clear, concise, and helpful answer. If relevant, cite sources using [number] notation."""
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "{question}")
            ])
            
            # Build chain
            chain = prompt | self.llm
            
            # Generate answer
            response = await chain.ainvoke({
                "context": context,
                "question": question
            })
            
            return {
                "answer": response.content,
                "model": settings.openai_llm_model,
                "temperature": settings.openai_temperature
            }
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            raise
    
    async def summarize(self, thread_content: str) -> Dict[str, Any]:
        """Summarize thread content using LangChain."""
        try:
            # Create summarization prompt
            system_prompt = """You are a thread summarization assistant for Community Brain.

Analyze the following discussion thread and provide a structured summary.

THREAD CONTENT:
{content}

Provide your response in the following JSON format:
{{
    "summary": "A 2-3 sentence executive summary",
    "key_points": ["Point 1", "Point 2", "Point 3"],
    "consensus": "Main consensus or conclusion (if any)",
    "open_questions": ["Question 1", "Question 2"] or null
}}

Ensure the JSON is valid."""
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "Please summarize this thread.")
            ])
            
            # Build chain
            chain = prompt | self.llm
            
            # Generate summary
            response = await chain.ainvoke({
                "content": thread_content
            })
            
            # Parse JSON response
            try:
                result = json.loads(response.content)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                result = {
                    "summary": response.content,
                    "key_points": [],
                    "consensus": None,
                    "open_questions": None
                }
            
            return result
        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            raise
    
    def _build_context(self, context_docs: List[Dict[str, Any]]) -> str:
        """Build context string from documents."""
        context_parts = []
        for idx, doc in enumerate(context_docs, 1):
            title = doc.get("title", "Untitled")
            content = doc.get("content", "")
            context_parts.append(f"[{idx}] {title}\n{content}\n")
        return "\n".join(context_parts)
