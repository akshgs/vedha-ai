from typing import List

from pydantic import BaseModel


class ResumeScanResponse(BaseModel):
    student_id: int
    filename: str
    target_role: str

    extracted_skills: List[str]
    total_skills_found: int

    match_percent: float
    matched_skills: List[str]
    missing_skills: List[str]

    ai_feedback: str