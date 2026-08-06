"""
app/api/v1/ai_coding.py
AI Coding Assistant API routes:
- Code explanation
- Code optimization
- Code debugging
- Big-O complexity analysis
- Problem hints
- Full coding assistant (unified endpoint)

Architecture:
  Route → coding_ai_service → RAG + LLM
  Submissions → problem_repository (for context)
"""
import time

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.repositories.ai_history_repository import AIHistoryRepository
from app.ai.services.coding_ai_service import (
    explain_code,
    optimize_code,
    debug_code,
    analyze_complexity,
    get_coding_hint,
    full_coding_assistant,
)
from app.schemas.ai import (
    CodeExplainRequest,
    CodeOptimizeRequest,
    CodeDebugRequest,
    BigORequest,
    CodingHintRequest,
    CodingAssistantRequest,
    CodingAssistantResponse,
)

router = APIRouter(prefix="/ai/coding", tags=["AI Coding Assistant"])


def _log(db, user_id, feature, input_text, output_text, duration_ms, status):
    try:
        AIHistoryRepository(db).log(
            user_id=user_id,
            feature=feature,
            input_summary=input_text[:200],
            output_summary=output_text[:200],
            duration_ms=duration_ms,
            status=status,
            model_used="llama-3.3-70b-versatile",
        )
    except Exception:
        pass


@router.post("/explain")
async def explain(
    request: CodeExplainRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Explain code in plain English with complexity analysis."""
    start = time.time()
    result = await explain_code(request.code, request.language)
    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log, db, current_user.id, "code_explain",
        f"{request.language}: {request.code[:100]}",
        str(result.get("explanation", ""))[:200],
        duration_ms, result.get("status", "success"),
    )
    return result


@router.post("/optimize")
async def optimize(
    request: CodeOptimizeRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Optimize code for performance and readability."""
    start = time.time()
    result = await optimize_code(request.code, request.language)
    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log, db, current_user.id, "code_optimize",
        f"{request.language}: {request.code[:100]}",
        str(result.get("explanation", ""))[:200],
        duration_ms, result.get("status", "success"),
    )
    return result


@router.post("/debug")
async def debug(
    request: CodeDebugRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Debug code and explain the fix."""
    start = time.time()
    result = await debug_code(request.code, request.error, request.language)
    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log, db, current_user.id, "code_debug",
        f"{request.language} | error: {request.error[:100]}",
        str(result.get("root_cause", ""))[:200],
        duration_ms, result.get("status", "success"),
    )
    return result


@router.post("/complexity")
async def complexity(
    request: BigORequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analyze Big-O time and space complexity."""
    start = time.time()
    result = await analyze_complexity(request.code, request.language)
    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log, db, current_user.id, "code_complexity",
        f"{request.language}: {request.code[:100]}",
        f"T:{result.get('time_complexity')} S:{result.get('space_complexity')}",
        duration_ms, result.get("status", "success"),
    )
    return result


@router.post("/hint")
async def coding_hint(
    request: CodingHintRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    AI-powered coding hint — gives direction without spoiling the solution.
    """
    start = time.time()
    result = await get_coding_hint(
        problem_title=request.problem_title,
        problem_desc=request.problem_desc,
        current_code=request.current_code,
        language=request.language,
    )
    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log, db, current_user.id, "code_hint",
        request.problem_title,
        str(result.get("hint", ""))[:200],
        duration_ms, result.get("status", "success"),
    )
    return result


@router.post("/assistant", response_model=CodingAssistantResponse)
async def coding_assistant(
    request: CodingAssistantRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Full coding assistant — unified endpoint used by the IDE.
    Returns complexity + explanation + debug hint + fix suggestion.
    """
    start = time.time()

    result = await full_coding_assistant(
        code=request.code,
        problem_id=request.problem_id,
        language=request.language,
        error_log=request.error_log,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log, db, current_user.id, "coding_assistant",
        f"problem_{request.problem_id} | {request.language}",
        str(result.get("time_complexity", ""))[:100],
        duration_ms, result.get("status", "success"),
    )

    return result
