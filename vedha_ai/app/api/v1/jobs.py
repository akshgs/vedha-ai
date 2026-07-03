from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.job_repository import JobRepository
from app.services.job_service import JobService

router = APIRouter()


@router.get("/recommend/{student_id}")
def recommend_jobs(
    student_id: int,
    db: Session = Depends(get_db),
):
    try:
        repository = JobRepository(db)
        service = JobService(repository)

        return service.recommend_jobs(student_id)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )