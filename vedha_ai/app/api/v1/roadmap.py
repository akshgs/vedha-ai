from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.roadmap_repository import (
    RoadmapRepository,
)
from app.services.roadmap_service import (
    RoadmapService,
)

router = APIRouter(
    prefix="/roadmap",
    tags=["Roadmap"],
)


@router.get("/{student_id}")
def generate_roadmap(
    student_id: int,
    db: Session = Depends(get_db),
):

    repository = RoadmapRepository(db)

    service = RoadmapService(repository)

    return service.generate_roadmap(
        student_id
    )