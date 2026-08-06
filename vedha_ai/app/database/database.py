from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

connect_args = {}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # 5-second connect timeout for PostgreSQL to prevent startup socket hangs on Render
    connect_args = {"connect_timeout": 5}

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()