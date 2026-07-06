from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy registers them
from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.models.job import Job
from app.models.interview import InterviewSession, InterviewAnswer


def init_db() -> None:
    Base.metadata.create_all(bind=engine)