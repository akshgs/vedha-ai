from pydantic import BaseModel


class RoadmapResponse(BaseModel):
    student_id: int
    target_role: str
    completed_skills: list[str]
    missing_skills: list[str]
    completion: float