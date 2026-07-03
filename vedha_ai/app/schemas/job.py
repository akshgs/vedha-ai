from pydantic import BaseModel


class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    location: str
    salary: str
    job_type: str
    source: str
    url: str
    match_percent: float


class JobRecommendationResponse(BaseModel):
    student_id: int
    recommended_jobs: list[JobResponse]