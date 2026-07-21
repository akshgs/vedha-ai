from app.models.profile import Profile
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile import ProfileCreate, ProfileUpdate


class ProfileService:

    def __init__(self, repository: ProfileRepository):
        self.repository = repository

    def get_profile(
        self,
        user_id: int,
    ) -> Profile | None:

        return self.repository.get_by_user_id(
            user_id=user_id,
        )

    def create_profile(
        self,
        user_id: int,
        profile: ProfileCreate,
    ) -> Profile:

        existing = self.repository.get_by_user_id(
            user_id=user_id,
        )

        if existing:
            raise ValueError(
                "Profile already exists."
            )

        return self.repository.create(
            user_id=user_id,
            profile=profile,
        )

    def update_profile(
        self,
        user_id: int,
        profile: ProfileUpdate,
    ) -> Profile:

        existing = self.repository.get_by_user_id(
            user_id=user_id,
        )

        if not existing:
            raise ValueError(
                "Profile not found."
            )

        return self.repository.update(
            db_profile=existing,
            profile=profile,
        ) 