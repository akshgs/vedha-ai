from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.services.recruitment_service import RecruitmentService
from app.models.user import User

router = APIRouter(prefix="/recruitment", tags=["Recruitment"])

class ApplyRequest(BaseModel):
    fileUrl: str

class BookRequest(BaseModel):
    slotId: int
    details: str

class OfferStatusRequest(BaseModel):
    status: str  # Accepted | Declined


@router.get("/applications")
def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve history list of user's sent job applications."""
    return RecruitmentService.get_applications(db, current_user.id)


@router.post("/jobs/{job_id}/apply")
def apply_to_job(
    job_id: int,
    payload: ApplyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Apply to a job listing with a resume URL."""
    return RecruitmentService.submit_application(db, current_user.id, job_id, payload.fileUrl)


@router.get("/interviews")
def get_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve user's scheduled human interviews list."""
    return RecruitmentService.get_interviews(db, current_user.id)


@router.get("/interviews/slots")
def get_available_slots(
    company: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Query available interview slots for a company."""
    return RecruitmentService.get_slots(db, company)


@router.post("/interviews/book")
def book_interview_slot(
    payload: BookRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Book a specific interview slot."""
    booking = RecruitmentService.book_meeting(db, current_user.id, payload.slotId, payload.details)
    if not booking:
        raise HTTPException(status_code=400, detail="Slot is unavailable or already booked.")
    return booking


@router.get("/offers")
def get_offers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch dispatched job offer letters list."""
    return RecruitmentService.get_offers(db, current_user.id)


@router.post("/offers/{offer_id}/status")
def update_offer_status(
    offer_id: int,
    payload: OfferStatusRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept or decline a job offer."""
    if payload.status not in ["Accepted", "Declined"]:
        raise HTTPException(status_code=400, detail="Status must be 'Accepted' or 'Declined'.")
    success = RecruitmentService.update_offer_status(db, current_user.id, offer_id, payload.status)
    if not success:
        raise HTTPException(status_code=404, detail="Offer not found or access denied.")
    return {"message": f"Offer {payload.status.lower()} successfully."}
