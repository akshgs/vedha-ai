from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user

from app.repositories.certification_repository import (
    CertificationRepository,
)

from app.schemas.certification import (
    CertificationCreate,
    CertificationUpdate,
    CertificationResponse,
)

from app.services.certification_service import (
    CertificationService,
)

router = APIRouter(
    prefix="/certification",
    tags=["Certification"],
)


def get_service(
    db: Session,
):
    repository = CertificationRepository(db)
    return CertificationService(repository)


@router.post(
    "/create",
    response_model=CertificationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certification(
    certification: CertificationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    return service.create(
        certification,
        current_user.id,
    )


@router.get(
    "/",
    response_model=list[CertificationResponse],
)
def get_certifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)
    return service.get_all(current_user.id)


@router.put(
    "/{certification_id}",
    response_model=CertificationResponse,
)
def update_certification(
    certification_id: int,
    certification: CertificationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    try:
        return service.update(
            certification_id,
            certification,
            current_user.id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.delete(
    "/{certification_id}",
)
def delete_certification(
    certification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    try:
        service.delete(
            certification_id,
            current_user.id,
        )

        return {
            "message": "Certification deleted successfully"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )