from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.interview import (
    InterviewEvaluateRequest,
    InterviewGenerateRequest,
    InterviewGenerateResponse,
)
from app.services.interview_service import InterviewService


router = APIRouter()


@router.post(
    "/generate",
    response_model=InterviewGenerateResponse,
)
def generate_interview(
    request: InterviewGenerateRequest,
    db: Session = Depends(get_db),
):
    return InterviewService.generate_interview(
        db=db,
        student_id=request.student_id,
        target_role=request.target_role,
    )


@router.post("/evaluate")
def evaluate_interview(
    request: InterviewEvaluateRequest,
):
    return InterviewService.evaluate(
        question=request.question,
        answer=request.answer,
        target_role=request.target_role,
    )