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

# Company
from app.api.v1.company import router as company_router
from app.api.v1.company_jobs import router as company_jobs_router
from app.api.v1.applications import router as applications_router
from app.api.v1.admin import router as admin_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("✅ Database initialized")
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


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Vedha AI Backend is running",
        "version": settings.APP_VERSION,
        "status": "healthy",
    }