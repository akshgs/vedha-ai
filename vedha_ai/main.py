from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.core.config import settings
from app.database.init_db import init_db
from app.api.v1.resume import router as resume_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.scraper import router as scraper_router










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

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

app.include_router(
    resume_router,
    prefix="/api/v1/resume",
    tags=["Resume"],
)

app.include_router(
    jobs_router,
    prefix="/api/v1/jobs",
    tags=["Jobs"],
)

app.include_router(
    scraper_router,
    prefix="/api/v1/scraper",
    tags=["Scraper"],
)

@app.get("/")
def root():
    return {
        "message": "Vedha AI Backend is running",
        "version": settings.APP_VERSION,
    }