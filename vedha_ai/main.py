import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.init_db import init_db

# Authentication
from app.api.v1.auth import router as auth_router

# Student
from app.api.v1.profile import router as profile_router
from app.api.v1.education import router as education_router
from app.api.v1.experience import router as experience_router
from app.api.v1.project import router as project_router
from app.api.v1.certification import router as certification_router
from app.api.v1.skill_router import router as skill_router

# Resume & AI
from app.api.v1.resume import router as resume_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.scraper import router as scraper_router
from app.api.v1.roadmap import router as roadmap_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.interview import router as interview_router
from app.api.v1.onboarding import router as onboarding_router

# Company
from app.api.v1.company import router as company_router
from app.api.v1.company_jobs import router as company_jobs_router
from app.api.v1.applications import router as applications_router
from app.api.v1.admin import router as admin_router
from app.api.v1.employee import router as employee_router

# Phase 9 — AI Platform
from app.api.v1.ai_mentor import router as ai_mentor_router
from app.api.v1.ai_resume import router as ai_resume_router
from app.api.v1.ai_coding import router as ai_coding_router
from app.api.v1.problems import router as problems_router, submissions_router, coding_meta_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.health import router as health_router
from app.api.v1.courses import router as courses_router
from app.api.v1.recruitment import router as recruitment_router
from app.api.v1.websocket import router as websocket_router
from app.api.v1.networking import router as networking_router, profiles_router
from app.api.v1.mentorship import router as mentorship_router
from app.api.v1.messages import router as messages_router


import asyncio
import time


@asynccontextmanager
async def lifespan(app: FastAPI):
    t_start = time.perf_counter()
    print(f"[STARTUP 1/3] Starting Vedha AI v{settings.APP_VERSION} in {settings.ENVIRONMENT} mode...")

    # Phase 1: Verify DB connectivity and create tables (non-blocking)
    t_db = time.perf_counter()
    try:
        init_db()
        db_elapsed = (time.perf_counter() - t_db) * 1000
        print(f"[STARTUP 2/3] Database schema verified in {db_elapsed:.2f}ms")
    except Exception as e:
        print(f"⚠️ [STARTUP WARNING] Database schema verification deferred: {e}")

    total_startup_ms = (time.perf_counter() - t_start) * 1000
    print(f"[STARTUP 3/3] FastAPI lifespan ready in {total_startup_ms:.2f}ms — Binding Uvicorn HTTP server socket now.")

    yield
    print("👋 Vedha AI stopped")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Authentication
# =========================
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])

# =========================
# Resume
# =========================
app.include_router(resume_router, prefix="/api/v1")

# =========================
# Jobs
# =========================
app.include_router(jobs_router, prefix="/api/v1")

# =========================
# Job Scraper
# =========================
app.include_router(scraper_router, prefix="/api/v1")

# =========================
# Roadmap
# =========================
app.include_router(roadmap_router, prefix="/api/v1")

# =========================
# Dashboard
# =========================
app.include_router(dashboard_router, prefix="/api/v1")

# =========================
# Interview
# =========================
app.include_router(interview_router, prefix="/api/v1")

# =========================
# Student Profile
# =========================
app.include_router(profile_router, prefix="/api/v1")
app.include_router(onboarding_router, prefix="/api/v1")
app.include_router(education_router, prefix="/api/v1")
app.include_router(experience_router, prefix="/api/v1")
app.include_router(project_router, prefix="/api/v1")
app.include_router(certification_router, prefix="/api/v1")
app.include_router(skill_router, prefix="/api/v1")

# =========================
# Company
# =========================
app.include_router(company_router, prefix="/api/v1")

# =========================
# Company Jobs
# =========================
app.include_router(company_jobs_router, prefix="/api/v1")

# =========================
# Applications
# =========================
app.include_router(applications_router, prefix="/api/v1")

# =========================
# Admin
# =========================
app.include_router(admin_router, prefix="/api/v1")

# =========================
# Employee
# =========================
app.include_router(employee_router, prefix="/api/v1")

# =========================================
# Phase 9 — AI Platform Routes
# =========================================

# AI Career Mentor + Salary + Career Path + Trends + Research + PDF Chat
app.include_router(ai_mentor_router, prefix="/api/v1")

# AI Resume Builder + Skill Gap + ATS Detail
app.include_router(ai_resume_router, prefix="/api/v1")

# AI Coding Assistant
app.include_router(ai_coding_router, prefix="/api/v1")

# Coding Problems & Submissions
app.include_router(problems_router, prefix="/api/v1")
app.include_router(submissions_router, prefix="/api/v1")
app.include_router(coding_meta_router, prefix="/api/v1")

# Courses Platform
app.include_router(courses_router, prefix="/api/v1")

# Recruitment Platform
app.include_router(recruitment_router, prefix="/api/v1")

# WebSockets
app.include_router(websocket_router)

# Social & Mentorship & Messaging Platform Routes
app.include_router(networking_router, prefix="/api/v1")
app.include_router(profiles_router, prefix="/api/v1")
app.include_router(mentorship_router, prefix="/api/v1")
app.include_router(messages_router, prefix="/api/v1")

# Notifications
app.include_router(notifications_router, prefix="/api/v1")

# Health Check (no auth)
app.include_router(health_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Vedha AI Backend is running",
        "version": settings.APP_VERSION,
        "status": "healthy",
        "docs": "/docs",
        "phase": "9 — AI Platform",
    }