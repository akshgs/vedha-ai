from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.init_db import init_db

from app.api.v1.auth import router as auth_router
from app.api.v1.resume import router as resume_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.scraper import router as scraper_router
from app.api.v1.roadmap import router as roadmap_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.interview import router as interview_router
from app.api.v1.profile import router as profile_router
from app.api.v1.education import router as education_router
from app.api.v1.experience import router as experience_router
from app.api.v1.project import router as project_router   
from app.api.v1.certification import router as certification_router 

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
app.include_router(auth_router, prefix="/api/v1/auth")


# =========================
# Resume
# router prefix = /resume
# Final URL = /api/v1/resume/*
# =========================
app.include_router(resume_router, prefix="/api/v1")


# =========================
# Jobs
# router prefix = /jobs
# Final URL = /api/v1/jobs/*
# =========================
app.include_router(jobs_router, prefix="/api/v1")


# =========================
# Job Scraper
# router prefix = /scraper
# Final URL = /api/v1/scraper/*
# =========================
app.include_router(scraper_router, prefix="/api/v1")


# =========================
# Roadmap
# router prefix = /roadmap
# Final URL = /api/v1/roadmap/*
# =========================
app.include_router(roadmap_router, prefix="/api/v1")


# =========================
# Dashboard
# router prefix = /dashboard
# Final URL = /api/v1/dashboard
# =========================
app.include_router(dashboard_router, prefix="/api/v1")


# =========================
# Interview
# router prefix = /interview
# Final URL = /api/v1/interview/*
# =========================
app.include_router(interview_router, prefix="/api/v1")


# =========================
# Profile
# router prefix = /profile
# Final URL = /api/v1/profile/*
# =========================
app.include_router(profile_router, prefix="/api/v1")


# =========================
# Education
# router prefix = /education
# Final URL = /api/v1/education/*
# =========================
app.include_router(education_router, prefix="/api/v1")


# =========================
# Experience
# router prefix = /experience
# Final URL = /api/v1/experience/*
# =========================
app.include_router(experience_router, prefix="/api/v1")


# =========================
# Project
# router prefix = /project
# Final URL = /api/v1/project/*
# =========================
app.include_router(project_router, prefix="/api/v1")   

# =========================
# Certification
# router prefix = /certification
# Final URL = /api/v1/certification/*
# =========================
app.include_router(certification_router, prefix="/api/v1") 


@app.get("/")
def root():
    return {
        "message": "Vedha AI Backend is running",
        "version": settings.APP_VERSION,
    }