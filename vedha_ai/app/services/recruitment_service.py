from sqlalchemy.orm import Session
from app.repositories.recruitment_repository import RecruitmentRepository

class RecruitmentService:
    @staticmethod
    def get_applications(db: Session, user_id: int) -> list[dict]:
        repo = RecruitmentRepository(db)
        return repo.get_sent_applications(user_id)

    @staticmethod
    def submit_application(db: Session, user_id: int, job_id: int, file_url: str) -> dict:
        repo = RecruitmentRepository(db)
        return repo.apply_to_job(user_id, job_id, file_url)

    @staticmethod
    def get_interviews(db: Session, user_id: int) -> list[dict]:
        repo = RecruitmentRepository(db)
        return repo.get_scheduled_interviews(user_id)

    @staticmethod
    def get_slots(db: Session, company_name: str) -> list[dict]:
        repo = RecruitmentRepository(db)
        return repo.get_available_slots(company_name)

    @staticmethod
    def book_meeting(db: Session, user_id: int, slot_id: int, details: str) -> dict:
        repo = RecruitmentRepository(db)
        booking = repo.book_slot(user_id, slot_id, details)
        return booking

    @staticmethod
    def get_offers(db: Session, user_id: int) -> list[dict]:
        repo = RecruitmentRepository(db)
        return repo.get_offers(user_id)

    @staticmethod
    def update_offer_status(db: Session, user_id: int, offer_id: int, status: str) -> bool:
        repo = RecruitmentRepository(db)
        return repo.update_offer_status(user_id, offer_id, status)
