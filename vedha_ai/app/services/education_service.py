from fastapi import HTTPException, status

from app.repositories.education_repository import EducationRepository
from app.schemas.education import EducationCreate, EducationUpdate


class EducationService:
    def __init__(self, repository):
        self.repository = repository

    def create_education(
        self,
        user_id: int,
        education: EducationCreate,
    ):
        return self.repository.create(
            user_id,
            education,
        )

    def get_educations(
        self,
        user_id: int,
    ):
        return self.repository.get_all(user_id)

    def get_education(
        self,
        education_id: int,
        user_id: int,
    ):
        education = self.repository.get_by_id(
            education_id,
            user_id,
        )

        if not education:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Education not found",
            )

        return education

    def update_education(
        self,
        education_id: int,
        user_id: int,
        education_data: EducationUpdate,
    ):
        education = self.get_education(
            education_id,
            user_id,
        )

        return self.repository.update(
            education,
            education_data,
        )

    def delete_education(
        self,
        education_id: int,
        user_id: int,
    ):
        education = self.get_education(
            education_id,
            user_id,
        )

        self.repository.delete(
            education,
        )

        return {
            "message": "Education deleted successfully"
        }