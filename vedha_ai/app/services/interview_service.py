import json

from sqlalchemy.orm import Session

from app.ai.interview_ai import generate_ai_questions
from app.ai.interview_evaluator import evaluate_answer
from app.ai.interview_generator import generate_questions
from app.repositories.interview_repository import InterviewRepository
from app.repositories.resume_repository import ResumeRepository


class InterviewService:

    @staticmethod
    def generate_interview(
        db: Session,
        student_id: int,
        target_role: str,
    ) -> dict:

        resume_repository = ResumeRepository(db)

        latest_resume = resume_repository.get_latest_by_student(
            student_id
        )

        skills: list[str] = []

        if latest_resume is not None:
            try:
                decoded_skills = json.loads(
                    latest_resume.matched_skills
                )

                if isinstance(decoded_skills, list):
                    skills = [
                        str(skill).strip()
                        for skill in decoded_skills
                        if str(skill).strip()
                    ]

            except (
                json.JSONDecodeError,
                TypeError,
            ):
                skills = []

        base_questions = generate_questions(
            target_role
        )

        all_base_questions = (
            base_questions.get("technical", [])
            + base_questions.get("hr", [])
        )

        ai_questions = generate_ai_questions(
            role=target_role,
            skills=skills,
            base_questions=all_base_questions,
        )

        interview_repository = InterviewRepository(db)

        interview_session = (
            interview_repository.create_session(
                student_id=student_id,
                target_role=target_role,
                base_questions=base_questions,
                ai_questions=ai_questions,
            )
        )

        return {
            "interview_id": interview_session.id,
            "base_questions": base_questions,
            "ai_questions": ai_questions,
        }

    @staticmethod
    def evaluate(
        question: str,
        answer: str,
        target_role: str,
    ):
        return evaluate_answer(
            question=question,
            answer=answer,
            target_role=target_role,
        )