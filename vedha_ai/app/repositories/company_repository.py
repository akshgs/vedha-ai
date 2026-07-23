from sqlalchemy.orm import Session

from app.models.company_profile import CompanyProfile


class CompanyRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, company: CompanyProfile):
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return company

    def get_by_id(self, company_id: int):
        return (
            self.db.query(CompanyProfile)
            .filter(CompanyProfile.id == company_id)
            .first()
        )

    def get_by_user_id(self, user_id: int):
        return (
            self.db.query(CompanyProfile)
            .filter(CompanyProfile.user_id == user_id)
            .first()
        )

    def get_by_company_name(self, company_name: str):
        return (
            self.db.query(CompanyProfile)
            .filter(CompanyProfile.company_name == company_name)
            .first()
        )

    def update(self, company: CompanyProfile):
        self.db.commit()
        self.db.refresh(company)
        return company

    def delete(self, company: CompanyProfile):
        self.db.delete(company)
        self.db.commit()