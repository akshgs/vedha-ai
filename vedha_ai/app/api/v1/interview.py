from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.interview import (
    InterviewCompleteRequest,
    InterviewCompleteResponse,
    InterviewDetailsResponse,
    InterviewEvaluateRequest,
    InterviewEvaluateResponse,
    InterviewGenerateRequest,
    InterviewGenerateResponse,
    InterviewHistoryResponse,
    InterviewReportResponse,
)
from app.security.jwt import get_current_user
from app.services.interview_service import InterviewService

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
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return InterviewService.generate_interview(
        db=db,
        student_id=current_user.id,
        target_role=request.target_role,
    )


@router.post(
    "/evaluate",
    response_model=InterviewEvaluateResponse,
)
def evaluate_interview(
    request: InterviewEvaluateRequest,
    current_user=Depends(get_current_user),
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
    "/history",
    response_model=InterviewHistoryResponse,
)
def interview_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    history = InterviewService.get_history(
        db=db,
        student_id=current_user.id,
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
    current_user=Depends(get_current_user),
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
    current_user=Depends(get_current_user),
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
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return InterviewService.generate_report(
        db=db,
        interview_id=interview_id,
    )