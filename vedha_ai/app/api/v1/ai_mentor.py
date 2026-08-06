"""
app/api/v1/ai_mentor.py
AI Career Mentor, Salary Prediction, Career Path, Industry Trends,
Research Assistant, and PDF Chat API routes.

Architecture:
  Route → Service (career_ai_service) → RAG + LLM
  Route → Repository (ai_history_repository) for audit logging
  Reuses: get_current_user, get_db, existing auth stack
"""
import time

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.repositories.ai_history_repository import AIHistoryRepository
from app.ai.memory.session_memory import session_memory
from app.ai.services.career_ai_service import (
    chat_with_career_mentor,
    predict_salary,
    predict_career_path,
    analyze_industry_trends,
    research_assistant,
    chat_with_pdf,
)
from app.ai.utils.text_cleaner import truncate_text
from app.utils.file_parser import extract_text
from app.schemas.ai import (
    CareerMentorRequest,
    CareerMentorResponse,
    ClearChatRequest,
    SalaryPredictionRequest,
    SalaryPredictionResponse,
    CareerPathRequest,
    CareerPathResponse,
    TrendsRequest,
    TrendsResponse,
    ResearchRequest,
    ResearchResponse,
    PDFChatRequest,
    PDFChatResponse,
)

router = APIRouter(prefix="/ai/mentor", tags=["AI Career Mentor"])


def _log_interaction(
    db: Session,
    user_id: int,
    feature: str,
    input_summary: str,
    output_summary: str,
    duration_ms: int,
    status: str,
) -> None:
    """Background-safe logging — never blocks the response."""
    try:
        repo = AIHistoryRepository(db)
        repo.log(
            user_id=user_id,
            feature=feature,
            input_summary=input_summary[:300],
            output_summary=output_summary[:300],
            duration_ms=duration_ms,
            status=status,
            model_used="llama-3.3-70b-versatile",
        )
    except Exception:
        pass  # Never fail the user request due to logging


@router.post("/chat", response_model=CareerMentorResponse)
async def career_mentor_chat(
    request: CareerMentorRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    AI Career Mentor — conversational, context-aware with memory.
    """
    start = time.time()

    result = await chat_with_career_mentor(
        user_id=current_user.id,
        message=request.message,
        current_role=request.current_role,
        target_role=request.target_role,
        skills=request.skills,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log_interaction,
        db=db,
        user_id=current_user.id,
        feature="career_mentor",
        input_summary=request.message,
        output_summary=result.get("reply", ""),
        duration_ms=duration_ms,
        status=result.get("status", "success"),
    )

    return result


@router.post("/clear-chat")
async def clear_career_chat(
    request: ClearChatRequest,
    current_user=Depends(get_current_user),
):
    """Clear the user's conversation memory for a given context."""
    session_memory.clear_session(current_user.id, context=request.context)
    return {"message": "Chat history cleared.", "context": request.context}


@router.post("/salary", response_model=SalaryPredictionResponse)
async def salary_prediction(
    request: SalaryPredictionRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Predict salary ranges for a role, skills, and location."""
    start = time.time()

    result = await predict_salary(
        role=request.role,
        skills=request.skills,
        experience_years=request.experience_years,
        location=request.location,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log_interaction,
        db=db,
        user_id=current_user.id,
        feature="salary_prediction",
        input_summary=f"{request.role} | {request.location}",
        output_summary=str(result.get("predicted_lpa", "")),
        duration_ms=duration_ms,
        status=result.get("status", "success"),
    )

    return result


@router.post("/career-path", response_model=CareerPathResponse)
async def career_path_prediction(
    request: CareerPathRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Predict career trajectories based on skills and experience."""
    start = time.time()

    result = await predict_career_path(
        current_skills=request.skills,
        experience_years=request.experience_years,
        current_role=request.current_role,
        interests=request.interests,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log_interaction,
        db=db,
        user_id=current_user.id,
        feature="career_prediction",
        input_summary=f"{request.current_role} | {request.experience_years}yr",
        output_summary=str(result.get("recommended_path", "")),
        duration_ms=duration_ms,
        status=result.get("status", "success"),
    )

    return result


@router.post("/trends", response_model=TrendsResponse)
async def industry_trends(
    request: TrendsRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analyze industry trends for a domain and skill set."""
    start = time.time()

    result = await analyze_industry_trends(
        domain=request.domain,
        skills=request.skills,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log_interaction,
        db=db,
        user_id=current_user.id,
        feature="industry_trends",
        input_summary=request.domain,
        output_summary=str(result.get("outlook", "")),
        duration_ms=duration_ms,
        status=result.get("status", "success"),
    )

    return result


@router.post("/research", response_model=ResearchResponse)
async def research_query(
    request: ResearchRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Research assistant — RAG-powered knowledge retrieval."""
    start = time.time()

    result = await research_assistant(query=request.query)

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log_interaction,
        db=db,
        user_id=current_user.id,
        feature="research",
        input_summary=request.query,
        output_summary=result.get("answer", "")[:200],
        duration_ms=duration_ms,
        status=result.get("status", "success"),
    )

    return result


# ── PDF Chat (two endpoints: upload + chat) ──────────────────────────────────

# In-process PDF text store (session-scoped)
_pdf_store: dict[str, str] = {}


@router.post("/pdf/upload")
async def upload_pdf_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """Upload a PDF or DOCX and extract its text for subsequent chat."""
    try:
        if file.content_type not in (
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ):
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are supported.",
            )

        file_bytes = await file.read()

        if len(file_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 10 MB).")

        text = extract_text(file_bytes, file.filename)

        if len(text) < 50:
            raise HTTPException(status_code=400, detail="Could not extract readable text from file.")

        session_key = f"{current_user.id}:pdf"
        _pdf_store[session_key] = text

        # Clear any existing PDF chat memory for this user
        session_memory.clear_session(current_user.id, context="pdf")

        return {
            "filename": file.filename,
            "text_length": len(text),
            "pages_estimated": len(text) // 3000 + 1,
            "message": "Document loaded. You can now chat with it.",
            "status": "success",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")


@router.post("/pdf/chat", response_model=PDFChatResponse)
async def pdf_chat(
    request: PDFChatRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Chat with an uploaded PDF/DOCX document."""
    session_key = f"{current_user.id}:pdf"
    document_text = _pdf_store.get(session_key)

    if not document_text:
        raise HTTPException(
            status_code=400,
            detail="No document loaded. Please upload a PDF or DOCX first via /pdf/upload.",
        )

    start = time.time()

    result = await chat_with_pdf(
        user_id=current_user.id,
        document_text=document_text,
        question=request.question,
        session_id=request.session_id,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log_interaction,
        db=db,
        user_id=current_user.id,
        feature="pdf_chat",
        input_summary=request.question,
        output_summary=result.get("answer", "")[:200],
        duration_ms=duration_ms,
        status=result.get("status", "success"),
    )

    return result


@router.get("/history")
async def ai_usage_history(
    feature: str | None = None,
    limit: int = 20,
    offset: int = 0,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's AI interaction history."""
    repo = AIHistoryRepository(db)
    records = repo.get_by_user(
        user_id=current_user.id,
        feature=feature,
        limit=limit,
        offset=offset,
    )
    total = repo.count_by_user(user_id=current_user.id, feature=feature)
    stats = repo.get_usage_stats(user_id=current_user.id)

    return {
        "history": [
            {
                "id": r.id,
                "feature": r.feature,
                "status": r.status,
                "duration_ms": r.duration_ms,
                "created_at": r.created_at,
            }
            for r in records
        ],
        "total": total,
        "usage_stats": stats,
    }
