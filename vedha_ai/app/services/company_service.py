from app.models.user import User
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import CompanyProfileCreate, CompanyProfileUpdate


class CompanyService:
    def __init__(self, repository: CompanyRepository):
        self.repository = repository

    def create_profile(self, current_user: User, data: CompanyProfileCreate):
        company = self.repository.get_by_user_id(current_user.id)

        if company:
            raise ValueError("Company profile already exists.")

        return self.repository.create(current_user.id, data)

    def get_profile(self, current_user: User):
        company = self.repository.get_by_user_id(current_user.id)

        if not company:
            raise ValueError("Company profile not found.")

        return company

    def update_profile(
        self,
        current_user: User,
        data: CompanyProfileUpdate,
    ):
        company = self.repository.get_by_user_id(current_user.id)

        if not company:
            raise ValueError("Company profile not found.")

        return self.repository.update(company, data)

    def delete_profile(self, current_user: User):
        company = self.repository.get_by_user_id(current_user.id)

        if not company:
            raise ValueError("Company profile not found.")

        self.repository.delete(company)

        return {
            "message": "Company profile deleted successfully."
        }