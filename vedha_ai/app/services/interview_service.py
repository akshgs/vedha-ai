import json

from sqlalchemy.orm import Session

from app.ai.interview_ai import generate_ai_questions
from app.ai.interview_evaluator import evaluate_answer
from app.ai.interview_generator import generate_questions
from app.ai.interview_report import generate_interview_report

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
        db: Session,
        interview_id: int,
        question: str,
        answer: str,
        target_role: str,
    ):

        interview_repository = InterviewRepository(db)

        session = interview_repository.get_session_by_id(
            interview_id
        )

        if session is None:
            raise ValueError(
                "Interview session not found."
            )

        evaluation = evaluate_answer(
            question=question,
            answer=answer,
            target_role=target_role,
        )

        interview_repository.save_answer(
            interview_id=interview_id,
            question=question,
            answer=answer,
            evaluation=evaluation,
        )

        return evaluation

    @staticmethod
    def get_history(
        db: Session,
        student_id: int,
    ):

        interview_repository = InterviewRepository(db)

        sessions = interview_repository.get_history(
            student_id
        )

        history = []

        for session in sessions:
            history.append(
                {
                    "interview_id": session.id,
                    "target_role": session.target_role,
                    "status": session.status,
                    "overall_score": session.overall_score,
                    "created_at": session.created_at,
                    "completed_at": session.completed_at,
                }
            )

        return history

    @staticmethod
    def get_interview_details(
        db: Session,
        interview_id: int,
    ):

        interview_repository = InterviewRepository(db)

        result = interview_repository.get_interview_details(
            interview_id
        )

        if result is None:
            raise ValueError(
                "Interview session not found."
            )

        session, answers = result

        answer_list = []

        for answer in answers:
            answer_list.append(
                {
                    "question": answer.question,
                    "answer": answer.answer,
                    "technical_score": answer.technical_score,
                    "communication_score": answer.communication_score,
                    "overall_score": answer.overall_score,
                    "strengths": json.loads(
                        answer.strengths
                    ),
                    "weaknesses": json.loads(
                        answer.weaknesses
                    ),
                    "suggestions": json.loads(
                        answer.suggestions
                    ),
                }
            )

        return {
            "interview_id": session.id,
            "target_role": session.target_role,
            "status": session.status,
            "overall_score": session.overall_score,
            "created_at": session.created_at,
            "completed_at": session.completed_at,
            "answers": answer_list,
        }

    @staticmethod
    def complete_interview(
        db: Session,
        interview_id: int,
    ):

        repository = InterviewRepository(db)

        answers = repository.get_answers(
            interview_id
        )

        if not answers:
            raise ValueError(
                "No interview answers found."
            )

        average_score = (
            sum(
                answer.overall_score
                for answer in answers
            )
            / len(answers)
        )

        session = repository.complete_session(
            interview_id=interview_id,
            overall_score=round(
                average_score,
                2,
            ),
        )

        if session is None:
            raise ValueError(
                "Interview session not found."
            )

        return {
            "interview_id": session.id,
            "status": session.status,
            "overall_score": session.overall_score,
            "message": "Interview completed successfully.",
        }

    @staticmethod
    def generate_report(
        db: Session,
        interview_id: int,
    ):

        repository = InterviewRepository(db)

        result = repository.get_interview_details(
            interview_id
        )

        if result is None:
            raise ValueError(
                "Interview session not found."
            )

        session, answers = result

        if not answers:
            raise ValueError(
                "No interview answers found."
            )

        questions = [
            answer.question
            for answer in answers
        ]

        candidate_answers = [
            answer.answer
            for answer in answers
        ]

        scores = [
            answer.overall_score
            for answer in answers
        ]

        return generate_interview_report(
            target_role=session.target_role,
            questions=questions,
            answers=candidate_answers,
            scores=scores,
        )