"""
app/ai/services/coding_ai_service.py
Centralized Coding AI Service.

Capabilities:
- Code explanation
- Code optimization
- Code debugging
- Big-O complexity analysis
- Coding hints for problems
- Full coding assistant (context-aware)

All capabilities reuse:
- app/ai/engine.py (LLM)
- app/ai/rag_engine.py (RAG retrieval)
- app/ai/prompts/coding.py (structured prompts)
- app/ai/utils/json_parser.py (JSON extraction)
"""
from langchain_core.output_parsers import StrOutputParser

from app.ai.engine import get_llm
from app.ai.rag_engine import retrieve_context
from app.ai.utils.json_parser import safe_extract_json
from app.ai.prompts.coding import (
    CODE_EXPLAIN_PROMPT,
    CODE_OPTIMIZE_PROMPT,
    CODE_DEBUG_PROMPT,
    BIG_O_PROMPT,
    CODING_HINT_PROMPT,
)

_llm = None
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


_explain_chain = LazyChain(CODE_EXPLAIN_PROMPT, 0.1)
_optimize_chain = LazyChain(CODE_OPTIMIZE_PROMPT, 0.1)
_debug_chain = LazyChain(CODE_DEBUG_PROMPT, 0.1)
_big_o_chain = LazyChain(BIG_O_PROMPT, 0.1)
_hint_chain = LazyChain(CODING_HINT_PROMPT, 0.1)




async def explain_code(code: str, language: str = "python") -> dict:
    """Explain code in plain English with complexity analysis."""
    try:
        raw = await _explain_chain.ainvoke({"code": code, "language": language})
        return {
            "explanation": raw,
            "language": language,
            "status": "success",
        }
    except Exception as e:
        return {"explanation": "Code explanation temporarily unavailable.", "error": str(e), "status": "error"}


async def optimize_code(code: str, language: str = "python") -> dict:
    """Optimize code for performance and readability."""
    try:
        context = retrieve_context(f"{language} code optimization best practices")
        raw = await _optimize_chain.ainvoke({
            "code": code,
            "language": language,
            "context": context,
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("original_code", code)
        result.setdefault("language", language)
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "issues": [],
            "optimized_code": code,
            "explanation": "Optimization service temporarily unavailable.",
            "status": "error",
            "error": str(e),
        }


async def debug_code(code: str, error: str, language: str = "python") -> dict:
    """Debug code given an error message."""
    try:
        context = retrieve_context(f"{language} {error} debugging fix")
        raw = await _debug_chain.ainvoke({
            "code": code,
            "language": language,
            "error": error,
            "context": context,
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "root_cause": "Debugging service temporarily unavailable.",
            "fixed_code": code,
            "explanation": str(e),
            "hint": "",
            "status": "error",
        }


async def analyze_complexity(code: str, language: str = "python") -> dict:
    """Analyze Big-O time and space complexity."""
    try:
        raw = await _big_o_chain.ainvoke({"code": code, "language": language})
        result = safe_extract_json(raw, fallback={})
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "time_complexity": "Unknown",
            "space_complexity": "Unknown",
            "reasoning": "Analysis temporarily unavailable.",
            "status": "error",
            "error": str(e),
        }


async def get_coding_hint(
    problem_title: str,
    problem_desc: str,
    current_code: str,
    language: str = "python",
) -> dict:
    """Give a helpful hint without revealing the full solution."""
    try:
        context = retrieve_context(f"{problem_title} algorithm approach hint")
        raw = await _hint_chain.ainvoke({
            "problem_title": problem_title,
            "problem_desc": problem_desc,
            "language": language,
            "current_code": current_code,
            "context": context,
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "hint": "Think about the most efficient data structure for this problem.",
            "approach": "Consider time vs space trade-offs.",
            "suggested_pattern": "",
            "status": "error",
            "error": str(e),
        }


async def full_coding_assistant(
    code: str,
    problem_id: int,
    language: str,
    error_log: str | None = None,
) -> dict:
    """
    Unified coding assistant endpoint.
    Returns: hint, explanation, suggested fix, complexity.
    """
    results = {}

    # Always compute complexity
    complexity = await analyze_complexity(code, language)
    results["time_complexity"] = complexity.get("time_complexity", "N/A")
    results["space_complexity"] = complexity.get("space_complexity", "N/A")

    # If error exists, debug
    if error_log:
        debug = await debug_code(code, error_log, language)
        results["debug_hint"] = debug.get("root_cause", "")
        results["suggested_fix"] = debug.get("fixed_code", code)
        results["explanation"] = debug.get("explanation", "")
    else:
        # Explain the code
        explain = await explain_code(code, language)
        results["explanation"] = explain.get("explanation", "")
        results["debug_hint"] = ""
        results["suggested_fix"] = ""

    results["status"] = "success"
    return results
