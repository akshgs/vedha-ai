"""
app/ai/services/career_ai_service.py
Centralized Career AI Service.

Capabilities:
- AI Career Mentor (conversational, with memory)
- Career Prediction
- Salary Prediction
- Industry Trends Analysis
- Research Assistant
- PDF Chat

REUSES:
- app/ai/engine.py (LLM)
- app/ai/rag_engine.py (RAG retrieval)
- app/ai/memory/session_memory.py (chat history)
- app/ai/prompts/career.py (structured prompts)
- app/ai/utils/json_parser.py (JSON extraction)
"""
from langchain_core.output_parsers import StrOutputParser

from app.ai.engine import get_llm
from app.ai.rag_engine import retrieve_context
from app.ai.memory.session_memory import session_memory
from app.ai.utils.json_parser import safe_extract_json
from app.ai.utils.text_cleaner import truncate_text, split_into_chunks
from app.ai.prompts.career import (
    CAREER_MENTOR_PROMPT,
    SALARY_PREDICTION_PROMPT,
    CAREER_PREDICTION_PROMPT,
    INDUSTRY_TRENDS_PROMPT,
    RESEARCH_ASSISTANT_PROMPT,
    PDF_CHAT_PROMPT,
)

_str_parser = StrOutputParser()


class LazyChain:
    def __init__(self, prompt, temperature, model="llama-3.3-70b-versatile"):
        self.prompt = prompt
        self.temperature = temperature
        self.model = model
        self._chain = None

    @property
    def chain(self):
        if self._chain is None:
            llm = get_llm(model=self.model, temperature=self.temperature)
            self._chain = self.prompt | llm | _str_parser
        return self._chain

    def invoke(self, *args, **kwargs):
        return self.chain.invoke(*args, **kwargs)

    async def ainvoke(self, *args, **kwargs):
        return await self.chain.ainvoke(*args, **kwargs)


_mentor_chain = LazyChain(CAREER_MENTOR_PROMPT, 0.4)
_salary_chain = LazyChain(SALARY_PREDICTION_PROMPT, 0.1)
_career_chain = LazyChain(CAREER_PREDICTION_PROMPT, 0.1)
_trends_chain = LazyChain(INDUSTRY_TRENDS_PROMPT, 0.1)
_research_chain = LazyChain(RESEARCH_ASSISTANT_PROMPT, 0.4)
_pdf_chain = LazyChain(PDF_CHAT_PROMPT, 0.4)




async def chat_with_career_mentor(
    user_id: int,
    message: str,
    current_role: str = "Student",
    target_role: str = "Software Engineer",
    skills: list[str] | None = None,
) -> dict:
    """
    Conversational career mentor with session memory.
    """
    try:
        context = retrieve_context(f"{target_role} career advice {message}")
        history = session_memory.format_history_string(user_id, context="career")

        reply = await _mentor_chain.ainvoke({
            "context": context,
            "message": message,
            "history": history,
            "current_role": current_role,
            "target_role": target_role,
            "skills": ", ".join(skills or []) or "Not specified",
        })

        # Store in memory
        session_memory.add_message(user_id, "user", message, context="career")
        session_memory.add_message(user_id, "assistant", reply, context="career")

        return {
            "reply": reply,
            "session_active": True,
            "status": "success",
        }
    except Exception as e:
        fallback = f"I'm here to help with your career journey! Could you tell me more about your goals? (Service note: {str(e)[:50]})"
        return {"reply": fallback, "session_active": True, "status": "fallback"}


async def predict_salary(
    role: str,
    skills: list[str],
    experience_years: int = 0,
    location: str = "India",
) -> dict:
    """Salary prediction with regional breakdown."""
    try:
        context = retrieve_context(f"{role} salary {location} package lpa")
        raw = await _salary_chain.ainvoke({
            "context": context,
            "role": role,
            "skills": ", ".join(skills),
            "experience_years": experience_years,
            "location": location,
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("role", role)
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "role": role,
            "location": location,
            "predicted_lpa": 8 + experience_years * 2,
            "growth_trajectory": "Positive",
            "top_paying_companies": ["Google", "Microsoft", "Amazon"],
            "reasoning": "Based on market averages.",
            "status": "fallback",
            "error": str(e),
        }


async def predict_career_path(
    current_skills: list[str],
    experience_years: int = 0,
    current_role: str = "Student",
    interests: list[str] | None = None,
) -> dict:
    """Multi-path career trajectory prediction."""
    try:
        context = retrieve_context(f"{current_role} career growth path technology")
        raw = await _career_chain.ainvoke({
            "context": context,
            "current_skills": ", ".join(current_skills),
            "experience_years": experience_years,
            "current_role": current_role,
            "interests": ", ".join(interests or []) or "technology, software development",
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "predicted_roles": [
                {"role": "Junior Developer", "timeline": "0-1 year", "probability": 0.85, "required_skills": current_skills[:3]},
                {"role": "Mid-level Engineer", "timeline": "2-3 years", "probability": 0.70, "required_skills": ["System Design", "Leadership"]},
            ],
            "recommended_path": "Software Engineering",
            "skill_investments": ["System Design", "Cloud", "Communication"],
            "market_demand": "High",
            "growth_probability": 0.80,
            "status": "fallback",
        }


async def analyze_industry_trends(
    domain: str,
    skills: list[str],
) -> dict:
    """Industry and market trends analysis."""
    try:
        context = retrieve_context(f"{domain} industry trends 2025 2026 demand")
        raw = await _trends_chain.ainvoke({
            "context": context,
            "domain": domain,
            "skills": ", ".join(skills),
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "trending_skills": ["AI/ML", "Cloud", "LLMs", "DevOps"],
            "declining_skills": ["jQuery", "Flash"],
            "emerging_technologies": ["Agentic AI", "Vector Databases"],
            "top_companies_hiring": ["Google", "Microsoft", "OpenAI", "Anthropic"],
            "average_salary_trend": "Increasing 15% YoY",
            "demand_index": 85,
            "supply_index": 40,
            "outlook": "Strong demand for AI/ML professionals",
            "status": "fallback",
        }


async def research_assistant(query: str) -> dict:
    """Research assistant using RAG knowledge base."""
    try:
        context = retrieve_context(query)
        answer = await _research_chain.ainvoke({
            "context": context,
            "query": query,
        })
        return {
            "query": query,
            "answer": answer,
            "sources": [],  # Could be populated from retriever metadata
            "status": "success",
        }
    except Exception as e:
        return {
            "query": query,
            "answer": "Research service temporarily unavailable. Please try again.",
            "sources": [],
            "status": "error",
            "error": str(e),
        }


async def chat_with_pdf(
    user_id: int,
    document_text: str,
    question: str,
    session_id: str = "pdf",
) -> dict:
    """
    PDF Chat — answer questions based on uploaded document content.
    Uses sliding window memory per session.
    """
    try:
        doc_context = truncate_text(document_text, max_chars=6000)
        history = session_memory.format_history_string(user_id, context=session_id)

        answer = await _pdf_chain.ainvoke({
            "document_context": doc_context,
            "chat_history": history,
            "question": question,
        })

        session_memory.add_message(user_id, "user", question, context=session_id)
        session_memory.add_message(user_id, "assistant", answer, context=session_id)

        return {
            "question": question,
            "answer": answer,
            "session_id": session_id,
            "status": "success",
        }
    except Exception as e:
        return {
            "question": question,
            "answer": "PDF chat service temporarily unavailable.",
            "status": "error",
            "error": str(e),
        }
