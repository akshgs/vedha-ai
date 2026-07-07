from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.repositories.resume_repository import ResumeRepository
from app.repositories.roadmap_repository import RoadmapRepository

from app.services.roadmap_service import RoadmapService

from app.schemas.roadmap import RoadmapResponse


router = APIRouter(
    prefix="/roadmap",
    tags=["Roadmap"],
)


@router.get(
    "/{student_id}",
    response_model=RoadmapResponse,
)
def generate_roadmap(
    student_id: int,
    db: Session = Depends(get_db),
):

    roadmap_repository = RoadmapRepository(db)
    resume_repository = ResumeRepository(db)

    service = RoadmapService(
        roadmap_repository=roadmap_repository,
        resume_repository=resume_repository,
    )

    return service.generate_roadmap(student_id)