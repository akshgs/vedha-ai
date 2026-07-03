from app.ai.resume_feedback import generate_feedback
from app.ai.skill_matcher import calculate_role_match
from app.nlp.skill_extractor import ROLE_SKILLS, extract_skills
from app.repositories.resume_repository import ResumeRepository
from app.utils.file_parser import extract_text


class ResumeService:

    def __init__(self, repository: ResumeRepository):
        self.repository = repository

    async def scan_resume(
        self,
        student_id: int,
        file_bytes: bytes,
        filename: str,
        target_role: str,
    ):

        if len(file_bytes) > 5 * 1024 * 1024:
            raise ValueError("File too large. Maximum size is 5 MB.")

        resume_text = extract_text(
            file_bytes,
            filename,
        )

        if len(resume_text) < 100:
            raise ValueError(
                "Resume text is too short."
            )

        skills = extract_skills(
            resume_text
        )

        if target_role not in ROLE_SKILLS:
            target_role = "Machine Learning Engineer"

        match = calculate_role_match(
            skills,
            target_role,
        )

        feedback = await generate_feedback(
            role=target_role,
            matched_skills=match["matched_skills"],
            missing_skills=match["missing_skills"],
            match_percent=match["match_percent"],
        )

        self.repository.create(
            student_id=student_id,
            target_role=target_role,
            match_percent=match["match_percent"],
            matched_skills=match["matched_skills"],
            missing_skills=match["missing_skills"],
            ai_feedback=feedback,
        )

        return {
            "student_id": student_id,
            "filename": filename,
            "target_role": target_role,
            "extracted_skills": skills,
            "total_skills_found": len(skills),
            "match_percent": match["match_percent"],
            "matched_skills": match["matched_skills"],
            "missing_skills": match["missing_skills"],
            "ai_feedback": feedback,
        }