from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy registers them
from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.models.job import Job
from app.models.interview import (
    InterviewSession,
    InterviewAnswer,
)
from app.models.roadmap import Roadmap
from app.models.profile import Profile
from app.models.education import Education
from app.models.experience import Experience
from app.models.project import Project
from app.models.certification import Certification
from app.models.skill import Skill

# Company Models
from app.models.company_profile import CompanyProfile
from app.models.company_job import CompanyJob
from app.models.application import Application


def init_db() -> None:
    Base.metadata.create_all(bind=engine)