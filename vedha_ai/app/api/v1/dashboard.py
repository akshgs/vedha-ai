from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.job_repository import JobRepository
from app.repositories.roadmap_repository import RoadmapRepository
from app.schemas.dashboard import DashboardResponse
from app.security.jwt import get_current_user
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Student dashboard only
    if current_user.role != "student":
        raise HTTPException(
            status_code=403,
            detail="Only students can access the dashboard.",
        )

    service = DashboardService(
        DashboardRepository(db),
        RoadmapRepository(db),
        JobRepository(db),
    )

    return service.get_dashboard(
        current_user.id
    )