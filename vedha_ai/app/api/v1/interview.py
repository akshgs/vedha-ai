from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.interview_service import InterviewService
from app.schemas.interview import (
    InterviewEvaluateRequest,
    InterviewGenerateRequest,
    InterviewGenerateResponse,
    InterviewHistoryResponse,
    InterviewDetailsResponse,
    InterviewCompleteRequest,
    InterviewCompleteResponse,
    InterviewReportResponse,
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)


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
    db: Session = Depends(get_db),
):

    return InterviewService.evaluate(
        db=db,
        interview_id=request.interview_id,
        question=request.question,
        answer=request.answer,
        target_role=request.target_role,
    )


@router.get(
    "/history/{student_id}",
    response_model=InterviewHistoryResponse,
)
def interview_history(
    student_id: int,
    db: Session = Depends(get_db),
):

    history = InterviewService.get_history(
        db=db,
        student_id=student_id,
    )

    return {
        "history": history,
    }


@router.get(
    "/{interview_id}",
    response_model=InterviewDetailsResponse,
)
def interview_details(
    interview_id: int,
    db: Session = Depends(get_db),
):

    return InterviewService.get_interview_details(
        db=db,
        interview_id=interview_id,
    )

@router.post(
    "/complete",
    response_model=InterviewCompleteResponse,
)
def complete_interview(
    request: InterviewCompleteRequest,
    db: Session = Depends(get_db),
):

    return InterviewService.complete_interview(
        db=db,
        interview_id=request.interview_id,
    )

@router.get(
    "/report/{interview_id}",
    response_model=InterviewReportResponse,
)
def interview_report(
    interview_id: int,
    db: Session = Depends(get_db),
):

    return InterviewService.generate_report(
        db=db,
        interview_id=interview_id,
    )