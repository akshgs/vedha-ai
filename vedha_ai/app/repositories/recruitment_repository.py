from sqlalchemy.orm import Session, joinedload
from app.models.application import Application
from app.models.company_job import CompanyJob
from app.models.company_profile import CompanyProfile
from app.models.recruitment_interview import RecruitmentInterviewSlot
from app.models.recruitment_offer import RecruitmentOffer
from app.models.user import User

class RecruitmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_sent_applications(self, user_id: int) -> list[dict]:
        apps = self.db.query(Application).filter(
            Application.student_id == user_id
        ).options(
            joinedload(Application.job).joinedload(CompanyJob.company)
        ).all()

        status_step_map = {
            "Applied": 1,
            "Resume Review": 2,
            "Interviewing": 3,
            "Offered": 4,
            "Hired": 5,
            "Rejected": 1
        }

        result = []
        for a in apps:
            job = a.job
            company_name = "Unknown Company"
            location = "Remote"
            job_title = "Software Engineer"
            
            if job:
                job_title = job.title
                location = job.location
                if job.company:
                    company_name = job.company.company_name
            
            result.append({
                "id": a.id,
                "jobTitle": job_title,
                "companyName": company_name,
                "location": location,
                "status": a.status,
                "appliedAt": a.created_at.strftime("%Y-%m-%d") if a.created_at else "2026-07-24",
                "step": status_step_map.get(a.status, 1)
            })
        return result

    def apply_to_job(self, user_id: int, job_id: int, file_url: str) -> dict:
        if job_id >= 10000:
            from app.models.job import Job
            scraped_job = self.db.query(Job).filter(Job.id == job_id - 10000).first()
            title = scraped_job.title if scraped_job else "Software Developer"
            company = scraped_job.company if scraped_job else "Company Partner"
            location = scraped_job.location if scraped_job else "Remote"
            return {
                "id": job_id,
                "jobTitle": title,
                "companyName": company,
                "location": location,
                "status": "Applied",
                "appliedAt": "2026-08-08",
                "step": 1
            }

        # Check if already applied
        existing = self.db.query(Application).filter(
            Application.student_id == user_id,
            Application.company_job_id == job_id
        ).first()

        if existing:
            return {
                "id": existing.id,
                "status": existing.status,
                "message": "Already applied to this job."
            }

        app = Application(
            student_id=user_id,
            company_job_id=job_id,
            cover_letter=f"Applied with resume: {file_url}",
            status="Applied"
        )
        self.db.add(app)
        self.db.commit()
        self.db.refresh(app)

        job = self.db.query(CompanyJob).filter(CompanyJob.id == job_id).first()
        company_name = "Unknown Company"
        job_title = "Software Engineer"
        location = "Remote"
        
        if job:
            job_title = job.title
            location = job.location
            company = self.db.query(CompanyProfile).filter(CompanyProfile.id == job.company_id).first()
            if company:
                company_name = company.company_name

        return {
            "id": app.id,
            "jobTitle": job_title,
            "companyName": company_name,
            "location": location,
            "status": app.status,
            "appliedAt": app.created_at.strftime("%Y-%m-%d"),
            "step": 1
        }

    def get_scheduled_interviews(self, user_id: int) -> list[dict]:
        slots = self.db.query(RecruitmentInterviewSlot).filter(
            RecruitmentInterviewSlot.candidate_id == user_id
        ).options(
            joinedload(RecruitmentInterviewSlot.job).joinedload(CompanyJob.company)
        ).all()

        result = []
        for s in slots:
            job_title = s.job.title if s.job else "Software Engineer"
            company_name = s.job.company.company_name if (s.job and s.job.company) else "Corporate Partner"
            
            result.append({
                "id": str(s.id),
                "jobTitle": job_title,
                "companyName": company_name,
                "date": s.date,
                "time": s.time,
                "interviewerName": s.interviewer_name,
                "status": s.status.capitalize()  # Scheduled | Completed | Cancelled
            })
        return result

    def get_available_slots(self, company_name: str) -> list[dict]:
        query = self.db.query(RecruitmentInterviewSlot).filter(
            RecruitmentInterviewSlot.status == "available"
        )
        
        if company_name:
            query = query.join(RecruitmentInterviewSlot.job).join(CompanyJob.company).filter(
                CompanyProfile.company_name.ilike(f"%{company_name}%")
            )
            
        slots = query.all()
        return [
            {
                "id": str(s.id),
                "date": s.date,
                "time": s.time,
                "available": True
            }
            for s in slots
        ]

    def book_slot(self, user_id: int, slot_id: int, details: str) -> dict | None:
        slot = self.db.query(RecruitmentInterviewSlot).filter(
            RecruitmentInterviewSlot.id == slot_id,
            RecruitmentInterviewSlot.status == "available"
        ).first()

        if not slot:
            return None

        slot.candidate_id = user_id
        slot.status = "booked"
        slot.details = details
        self.db.commit()
        self.db.refresh(slot)

        # Also update the candidate's application status to "Interviewing"
        app = self.db.query(Application).filter(
            Application.student_id == user_id,
            Application.company_job_id == slot.company_job_id
        ).first()
        
        if app:
            app.status = "Interviewing"
            self.db.commit()

        job_title = slot.job.title if slot.job else "Software Engineer"
        company_name = slot.job.company.company_name if (slot.job and slot.job.company) else "Corporate Partner"

        return {
            "id": str(slot.id),
            "jobTitle": job_title,
            "companyName": company_name,
            "date": slot.date,
            "time": slot.time,
            "interviewerName": slot.interviewer_name,
            "status": "Scheduled"
        }

    def get_offers(self, user_id: int) -> list[dict]:
        offers = self.db.query(RecruitmentOffer).filter(
            RecruitmentOffer.student_id == user_id
        ).options(
            joinedload(RecruitmentOffer.job).joinedload(CompanyJob.company)
        ).all()

        return [
            {
                "id": str(o.id),
                "jobTitle": o.job.title if o.job else "Software Engineer",
                "companyName": o.job.company.company_name if (o.job and o.job.company) else "Corporate Partner",
                "salary": o.salary,
                "deadline": o.deadline,
                "status": o.status  # Pending | Accepted | Declined
            }
            for o in offers
        ]

    def update_offer_status(self, user_id: int, offer_id: int, status: str) -> bool:
        offer = self.db.query(RecruitmentOffer).filter(
            RecruitmentOffer.id == offer_id,
            RecruitmentOffer.student_id == user_id
        ).first()

        if not offer:
            return False

        offer.status = status
        self.db.commit()

        # Update application status to "Hired" if accepted
        app = self.db.query(Application).filter(
            Application.student_id == user_id,
            Application.company_job_id == offer.company_job_id
        ).first()

        if app:
            if status == "Accepted":
                app.status = "Hired"
            elif status == "Declined":
                app.status = "Rejected"
            self.db.commit()

        return True
