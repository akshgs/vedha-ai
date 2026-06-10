# utils/db.py — Updated for PostgreSQL
import os
from sqlalchemy import create_engine, text, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./vedha_ai.db")

if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=False
    )
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

# ─── Models ───────────────────────────────────────
class Student(Base):
    __tablename__ = "students"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(150), unique=True, index=True)
    password   = Column(String(255), nullable=False)
    goal       = Column(String(200))
    skills     = Column(Text, default="[]")
    quiz_score = Column(Float, default=0.0)
    role       = Column(String(20), default="student")
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, index=True)
    role       = Column(String(20))
    message    = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, index=True)
    topic      = Column(String(100))
    score      = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, index=True)

    target_role = Column(String(100))
    match_percent = Column(Float)

    matched_skills = Column(Text)
    missing_skills = Column(Text)

    ai_feedback = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    
# ─── Helpers ──────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_connection():
    return SessionLocal()

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables ready!")