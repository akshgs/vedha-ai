from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy registers them
from app.models.user import User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    
    