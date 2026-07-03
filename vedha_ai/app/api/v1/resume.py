from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.resume_repository import ResumeRepository
from app.services.resume_service import ResumeService

router = APIRouter()


@router.post("/upload")
async def upload_resume(
    student_id: int = Form(...),
    file: UploadFile = File(...),
    target_role: str = Form("Machine Learning Engineer"),
    db: Session = Depends(get_db),
):
    try:
        repository = ResumeRepository(db)
        service = ResumeService(repository)

        file_bytes = await file.read()

        return await service.scan_resume(
            student_id=student_id,
            file_bytes=file_bytes,
            filename=file.filename,
            target_role=target_role,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )