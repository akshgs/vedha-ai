"""
app/repositories/problem_repository.py
Data access layer for coding problems and submissions.
"""
import json
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.problem import Problem
from app.models.submission import Submission


class ProblemRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        difficulty: str | None = None,
        tag: str | None = None,
        search: str | None = None,
        limit: int = 20,
        offset: int = 0,
        active_only: bool = True,
    ) -> tuple[list[Problem], int]:
        query = self.db.query(Problem)
        if active_only:
            query = query.filter(Problem.is_active == True)
        if difficulty:
            query = query.filter(Problem.difficulty == difficulty.lower())
        if tag:
            query = query.filter(Problem.tags.contains(tag))
        if search:
            query = query.filter(Problem.title.ilike(f"%{search}%"))
        total = query.count()
        items = query.order_by(Problem.id).offset(offset).limit(limit).all()
        return items, total

    def get_by_id(self, problem_id: int) -> Problem | None:
        return self.db.query(Problem).filter(Problem.id == problem_id).first()

    def get_by_slug(self, slug: str) -> Problem | None:
        return self.db.query(Problem).filter(Problem.slug == slug).first()

    def create(
        self,
        title: str,
        slug: str,
        description: str,
        difficulty: str,
        tags: list[str] | None = None,
        examples: list[dict] | None = None,
        constraints: str | None = None,
        hints: list[str] | None = None,
        starter_code: dict | None = None,
        solution: str | None = None,
        editorial: str | None = None,
        is_premium: bool = False,
    ) -> Problem:
        problem = Problem(
            title=title,
            slug=slug,
            description=description,
            difficulty=difficulty,
            tags=json.dumps(tags or []),
            examples=json.dumps(examples or []),
            constraints=constraints,
            hints=json.dumps(hints or []),
            starter_code=json.dumps(starter_code or {}),
            solution=solution,
            editorial=editorial,
            is_premium=is_premium,
        )
        self.db.add(problem)
        self.db.commit()
        self.db.refresh(problem)
        return problem

    def update_acceptance_rate(self, problem_id: int) -> None:
        problem = self.get_by_id(problem_id)
        if problem and problem.total_submissions > 0:
            problem.acceptance_rate = round(
                (problem.total_accepted / problem.total_submissions) * 100
            )
            self.db.commit()

    def increment_submission_count(self, problem_id: int, accepted: bool) -> None:
        problem = self.get_by_id(problem_id)
        if problem:
            problem.total_submissions += 1
            if accepted:
                problem.total_accepted += 1
            self.db.commit()


class SubmissionRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        user_id: int,
        problem_id: int,
        language: str,
        code: str,
        verdict: str = "pending",
        runtime_ms: int | None = None,
        memory_kb: int | None = None,
        test_cases_passed: int | None = None,
        total_test_cases: int | None = None,
        error_log: str | None = None,
        ai_feedback: str | None = None,
        is_contest: bool = False,
    ) -> Submission:
        sub = Submission(
            user_id=user_id,
            problem_id=problem_id,
            language=language,
            code=code,
            verdict=verdict,
            runtime_ms=runtime_ms,
            memory_kb=memory_kb,
            test_cases_passed=test_cases_passed,
            total_test_cases=total_test_cases,
            error_log=error_log,
            ai_feedback=ai_feedback,
            is_contest_submission=is_contest,
        )
        self.db.add(sub)
        self.db.commit()
        self.db.refresh(sub)
        return sub

    def get_by_user(
        self,
        user_id: int,
        problem_id: int | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Submission], int]:
        query = self.db.query(Submission).filter(Submission.user_id == user_id)
        if problem_id:
            query = query.filter(Submission.problem_id == problem_id)
        total = query.count()
        items = query.order_by(Submission.created_at.desc()).offset(offset).limit(limit).all()
        return items, total

    def get_by_id(self, submission_id: int) -> Submission | None:
        return self.db.query(Submission).filter(Submission.id == submission_id).first()

    def update_verdict(
        self,
        submission_id: int,
        verdict: str,
        runtime_ms: int | None = None,
        memory_kb: int | None = None,
        test_cases_passed: int | None = None,
        total_test_cases: int | None = None,
        error_log: str | None = None,
        ai_feedback: str | None = None,
    ) -> Submission | None:
        sub = self.get_by_id(submission_id)
        if sub:
            sub.verdict = verdict
            if runtime_ms is not None:
                sub.runtime_ms = runtime_ms
            if memory_kb is not None:
                sub.memory_kb = memory_kb
            if test_cases_passed is not None:
                sub.test_cases_passed = test_cases_passed
            if total_test_cases is not None:
                sub.total_test_cases = total_test_cases
            if error_log is not None:
                sub.error_log = error_log
            if ai_feedback is not None:
                sub.ai_feedback = ai_feedback
            self.db.commit()
            self.db.refresh(sub)
        return sub

    def get_user_accepted_count(self, user_id: int) -> int:
        return (
            self.db.query(Submission)
            .filter(
                Submission.user_id == user_id,
                Submission.verdict == "accepted",
            )
            .distinct(Submission.problem_id)
            .count()
        )
