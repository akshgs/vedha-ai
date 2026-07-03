from app.repositories.job_repository import JobRepository
from app.scrapers.remotive import fetch_remotive_jobs


class ScraperService:

    def __init__(self, repository: JobRepository):
        self.repository = repository

    def scrape_jobs(self):

        jobs = fetch_remotive_jobs()

        self.repository.save_jobs(jobs)

        return {
            "status": "success",
            "jobs_scraped": len(jobs),
        }