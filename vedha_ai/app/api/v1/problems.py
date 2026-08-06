"""
app/api/v1/problems.py
Coding Problems, Run, Submit, Submissions, Stats, and Leaderboard APIs.
Reuses: get_current_user, get_db, ProblemRepository, SubmissionRepository.
"""
import json
import math
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.repositories.problem_repository import ProblemRepository, SubmissionRepository
from app.services.compiler_service import CompilerService
from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission

router = APIRouter(prefix="/coding/problems", tags=["Coding Problems"])
submissions_router = APIRouter(prefix="/coding/submissions", tags=["Coding Submissions"])
coding_meta_router = APIRouter(prefix="/coding", tags=["Coding Metadata"])


def _map_verdict_to_status(verdict: str) -> str:
    mapping = {
        "accepted": "Accepted",
        "wrong_answer": "Wrong Answer",
        "runtime_error": "Runtime Error",
        "compilation_error": "Compilation Error",
        "pending": "Pending"
    }
    return mapping.get(verdict.lower(), "Wrong Answer")


# ── Problem Catalog ───────────────────────────────────────────────────────────

@router.get("/")
def list_problems(
    difficulty: str | None = Query(default=None, description="easy | medium | hard"),
    tag: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all active problems with filtering and pagination."""
    repo = ProblemRepository(db)
    offset = (page - 1) * page_size
    items, total = repo.get_all(
        difficulty=difficulty,
        tag=tag,
        search=search,
        limit=page_size,
        offset=offset,
    )

    problem_list = []
    for p in items:
        tags = []
        try:
            tags = json.loads(p.tags) if p.tags else []
        except Exception:
            pass
            
        # Check if solved by current user
        solved = db.query(Submission).filter(
            Submission.user_id == current_user.id,
            Submission.problem_id == p.id,
            Submission.verdict == "accepted"
        ).count() > 0

        problem_list.append({
            "id": p.id,
            "title": p.title,
            "difficulty": p.difficulty.capitalize(),  # Frontend expects capitalized
            "category": tags[0] if tags else "General",
            "solved": solved,
            "acceptance_rate": p.acceptance_rate or 0,
            "total_submissions": p.total_submissions,
            "is_premium": p.is_premium,
            "desc": p.description,
        })

    return problem_list


@router.get("/{problem_id}")
def get_problem(
    problem_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get problem detail — description, examples, constraints, starter code."""
    repo = ProblemRepository(db)
    problem = repo.get_by_id(problem_id)

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found.")

    def _parse_json(field, fallback):
        try:
            return json.loads(field) if field else fallback
        except Exception:
            return fallback

    # Check if solved
    solved = db.query(Submission).filter(
        Submission.user_id == current_user.id,
        Submission.problem_id == problem.id,
        Submission.verdict == "accepted"
    ).count() > 0

    tags = _parse_json(problem.tags, [])
    starter_codes = _parse_json(problem.starter_code, {})
    
    # Return structure matching frontend expectation
    return {
        "id": problem.id,
        "title": problem.title,
        "difficulty": problem.difficulty.capitalize(),
        "category": tags[0] if tags else "General",
        "solved": solved,
        "desc": problem.description,
        "starterCode": starter_codes.get("javascript") or starter_codes.get("python") or "",
        "testCases": "Injected automatically",
        "expected": "Checked on assertions",
    }


# ── Run Code (Sandbox Execution) ──────────────────────────────────────────────

@router.post("/{problem_id}/run")
async def run_solution(
    problem_id: int,
    payload: dict,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Run user code against example test cases using compiler sandbox.
    Does not save to submissions.
    """
    problem_repo = ProblemRepository(db)
    problem = problem_repo.get_by_id(problem_id)

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found.")

    code = payload.get("code", "").strip()
    language = payload.get("language", "python").strip().lower()

    if not code:
        raise HTTPException(status_code=400, detail="Code cannot be empty.")

    try:
        examples = json.loads(problem.examples) if problem.examples else []
    except Exception:
        examples = []

    res = CompilerService.execute_code(
        language=language,
        code=code,
        examples=examples,
        slug=problem.slug
    )

    return {
        "status": res.status,
        "output": res.output if res.status == "success" else f"Error: {res.error_log}\n{res.output}"
    }


# ── Submit Code (Sandbox Execution & DB Submission) ───────────────────────────

@router.post("/{problem_id}/submit")
async def submit_solution(
    problem_id: int,
    payload: dict,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit user code. Runs it in the compiler sandbox, saves submission, and returns status.
    """
    problem_repo = ProblemRepository(db)
    problem = problem_repo.get_by_id(problem_id)

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found.")

    code = payload.get("code", "").strip()
    language = payload.get("language", "python").strip().lower()

    if not code:
        raise HTTPException(status_code=400, detail="Code cannot be empty.")

    try:
        examples = json.loads(problem.examples) if problem.examples else []
    except Exception:
        examples = []

    # Execute sandbox
    res = CompilerService.execute_code(
        language=language,
        code=code,
        examples=examples,
        slug=problem.slug
    )

    # Determine verdict
    if res.status == "success":
        verdict = "accepted" if res.test_cases_passed == res.total_test_cases else "wrong_answer"
    else:
        if "Time Limit Exceeded" in str(res.error_log):
            verdict = "time_limit_exceeded"
        elif "Compilation" in str(res.error_log):
            verdict = "compilation_error"
        else:
            verdict = "runtime_error"

    # Create submission record
    sub_repo = SubmissionRepository(db)
    submission = sub_repo.create(
        user_id=current_user.id,
        problem_id=problem_id,
        language=language,
        code=code,
        verdict=verdict,
        runtime_ms=res.runtime_ms or 50,
        memory_kb=res.memory_kb or 16000,
        test_cases_passed=res.test_cases_passed or 0,
        total_test_cases=res.total_test_cases or len(examples),
        error_log=res.error_log,
        is_contest=False
    )

    # Increment problem submission count & update acceptance rate
    problem_repo.increment_submission_count(problem_id, accepted=(verdict == "accepted"))
    problem_repo.update_acceptance_rate(problem_id)

    status_str = _map_verdict_to_status(verdict)
    output_msg = res.output if verdict == "accepted" else f"Assertion failed or error logged.\n{res.error_log}\n{res.output}"
    
    return {
        "status": res.status,
        "output": f"Verdict: {status_str}\n{output_msg}",
        "runtime": f"{submission.runtime_ms} ms",
        "memory": f"{(submission.memory_kb or 16000) / 1024:.1f} MB"
    }


# ── Submissions Router ────────────────────────────────────────────────────────

@submissions_router.get("/")
def list_submissions(
    problemId: int | None = Query(default=None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get submission history (optionally filtered by problemId)."""
    sub_repo = SubmissionRepository(db)
    items, total = sub_repo.get_by_user(
        user_id=current_user.id,
        problem_id=problemId,
        limit=100,
        offset=0
    )

    result = []
    for s in items:
        # Load problem details
        problem = db.query(Problem).filter(Problem.id == s.problem_id).first()
        title = problem.title if problem else "Unknown Problem"
        
        result.append({
            "id": s.id,
            "problemId": s.problem_id,
            "problemTitle": title,
            "status": _map_verdict_to_status(s.verdict),
            "language": s.language.capitalize(),
            "runtime": f"{s.runtime_ms or 0} ms",
            "memory": f"{(s.memory_kb or 0) / 1024:.1f} MB",
            "submittedAt": s.created_at.isoformat() if s.created_at else datetime.utcnow().isoformat(),
            "code": s.code
        })
    return result


@submissions_router.get("/{submission_id}")
def get_submission(
    submission_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get single submission detail."""
    sub_repo = SubmissionRepository(db)
    s = sub_repo.get_by_id(submission_id)

    if not s:
        raise HTTPException(status_code=404, detail="Submission not found.")

    if s.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied.")

    problem = db.query(Problem).filter(Problem.id == s.problem_id).first()
    title = problem.title if problem else "Unknown Problem"

    return {
        "id": s.id,
        "problemId": s.problem_id,
        "problemTitle": title,
        "status": _map_verdict_to_status(s.verdict),
        "language": s.language.capitalize(),
        "runtime": f"{s.runtime_ms or 0} ms",
        "memory": f"{(s.memory_kb or 0) / 1024:.1f} MB",
        "submittedAt": s.created_at.isoformat() if s.created_at else datetime.utcnow().isoformat(),
        "code": s.code
    }


# ── Coding Metadata Router ────────────────────────────────────────────────────

@coding_meta_router.get("/stats")
def get_coding_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get coding progress statistics (easy, med, hard, streak)."""
    # Count totals
    total_easy = db.query(Problem).filter(Problem.difficulty == "easy", Problem.is_active == True).count()
    total_med = db.query(Problem).filter(Problem.difficulty == "medium", Problem.is_active == True).count()
    total_hard = db.query(Problem).filter(Problem.difficulty == "hard", Problem.is_active == True).count()

    # Count solved by user (unique problem ids)
    solved_easy = db.query(Submission).join(Problem).filter(
        Submission.user_id == current_user.id,
        Submission.verdict == "accepted",
        Problem.difficulty == "easy"
    ).distinct(Submission.problem_id).count()

    solved_med = db.query(Submission).join(Problem).filter(
        Submission.user_id == current_user.id,
        Submission.verdict == "accepted",
        Problem.difficulty == "medium"
    ).distinct(Submission.problem_id).count()

    solved_hard = db.query(Submission).join(Problem).filter(
        Submission.user_id == current_user.id,
        Submission.verdict == "accepted",
        Problem.difficulty == "hard"
    ).distinct(Submission.problem_id).count()

    # Calculate streak from submission dates
    dates_queried = db.query(Submission.created_at).filter(
        Submission.user_id == current_user.id
    ).order_by(Submission.created_at.desc()).all()
    
    unique_dates = sorted(list(set([d[0].date() for d in dates_queried if d[0]])), reverse=True)
    
    streak = 0
    if unique_dates:
        today = date.today()
        # If user did not submit today or yesterday, streak is broken
        if (today - unique_dates[0]).days <= 1:
            streak = 1
            for idx in range(len(unique_dates) - 1):
                diff = (unique_dates[idx] - unique_dates[idx + 1]).days
                if diff == 1:
                    streak += 1
                elif diff > 1:
                    break
        else:
            streak = 0

    return {
        "easy": f"{solved_easy}/{total_easy or 10}",
        "med": f"{solved_med}/{total_med or 10}",
        "hard": f"{solved_hard}/{total_hard or 10}",
        "streak": streak or 1
    }


@coding_meta_router.get("/leaderboard")
def get_coding_leaderboard(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get global coding leaderboard ranked by points."""
    users = db.query(User).filter(User.role == "student", User.status == "active").all()
    
    leaderboard = []
    for u in users:
        # count accepted easy, medium, hard
        easy_cnt = db.query(Submission).join(Problem).filter(
            Submission.user_id == u.id,
            Submission.verdict == "accepted",
            Problem.difficulty == "easy"
        ).distinct(Submission.problem_id).count()

        med_cnt = db.query(Submission).join(Problem).filter(
            Submission.user_id == u.id,
            Submission.verdict == "accepted",
            Problem.difficulty == "medium"
        ).distinct(Submission.problem_id).count()

        hard_cnt = db.query(Submission).join(Problem).filter(
            Submission.user_id == u.id,
            Submission.verdict == "accepted",
            Problem.difficulty == "hard"
        ).distinct(Submission.problem_id).count()

        points = easy_cnt * 10 + med_cnt * 20 + hard_cnt * 30
        
        leaderboard.append({
            "name": u.name,
            "points": points,
            "avatar": u.name[0] if u.name else "U",
            "self": u.id == current_user.id
        })
        
    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    
    # Map ranks
    for rank, item in enumerate(leaderboard):
        item["rank"] = rank + 1
        
    return leaderboard[:10]  # Return top 10
