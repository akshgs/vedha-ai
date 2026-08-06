"""
app/api/v1/health.py
Health check endpoint — verifies DB, AI, and vector store connectivity.
No auth required (for load balancer / monitoring probes).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import get_db
from app.schemas.common import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """Platform health check."""
    # DB
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    # AI / LLM
    ai_status = "operational"
    try:
        from app.ai.engine import get_llm
        get_llm()
    except Exception:
        ai_status = "degraded"

    # Vector store
    vector_status = "loaded"
    try:
        from app.knowledge.knowledge_service import get_knowledge_service
        ks = get_knowledge_service()
        ks._initialize()
    except Exception:
        vector_status = "unloaded"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        version="1.0.0",
        database=db_status,
        ai_service=ai_status,
        vector_store=vector_status,
    )


@router.get("/ping")
def ping():
    """Simple ping — returns 200 immediately."""
    return {"pong": True}
