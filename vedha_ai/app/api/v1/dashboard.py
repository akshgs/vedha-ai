from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.job_repository import JobRepository
from app.repositories.roadmap_repository import RoadmapRepository
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/{student_id}",
    response_model=DashboardResponse,
)
def get_dashboard(
    student_id: int,
    db: Session = Depends(get_db),
):

    service = DashboardService(
        DashboardRepository(db),
        RoadmapRepository(db),
        JobRepository(db),
    )

    return service.get_dashboard(student_id)