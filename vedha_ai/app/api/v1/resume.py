from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    Form,
)
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.resume_repository import ResumeRepository
from app.security.jwt import get_current_user
from app.services.resume_service import ResumeService

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    target_role: str = Form(
        "Machine Learning Engineer"
    ),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = ResumeRepository(db)

        service = ResumeService(repository)

        file_bytes = await file.read()

        return await service.scan_resume(
            student_id=current_user.id,
            file_bytes=file_bytes,
            filename=file.filename,
            target_role=target_role,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )