from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.job_repository import JobRepository
from app.services.scraper_service import ScraperService

router = APIRouter()


@router.post("/scrape")
def scrape_jobs(
    db: Session = Depends(get_db),
):
    repository = JobRepository(db)
    service = ScraperService(repository)

    return service.scrape_jobs()