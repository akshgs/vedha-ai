from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.job_repository import JobRepository
from app.security.jwt import get_current_user
from app.services.job_service import JobService

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.get("/recommend")
def recommend_jobs(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = JobRepository(db)
        service = JobService(repository)

        return service.recommend_jobs(
            current_user.id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )