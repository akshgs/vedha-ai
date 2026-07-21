from sqlalchemy.orm import Session

from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate


URL_FIELDS = ["github_url", "linkedin_url", "portfolio_url"]


class ProfileRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(
        self,
        user_id: int,
    ):

        return (
            self.db.query(Profile)
            .filter(Profile.user_id == user_id)
            .first()
        )

    def create(
        self,
        user_id: int,
        profile: ProfileCreate,
    ):

        data = profile.model_dump(exclude_unset=True)

        for field in URL_FIELDS:
            if data.get(field) is not None:
                data[field] = str(data[field])

        db_profile = Profile(
            user_id=user_id,
            **data,
        )

        self.db.add(db_profile)
        self.db.commit()
        self.db.refresh(db_profile)

        return db_profile

    def update(
        self,
        db_profile: Profile,
        profile: ProfileUpdate,
    ):

        data = profile.model_dump(exclude_unset=True)

        for field in URL_FIELDS:
            if data.get(field) is not None:
                data[field] = str(data[field])

        for key, value in data.items():
            setattr(
                db_profile,
                key,
                value,
            )

        self.db.commit()
        self.db.refresh(db_profile)

        return db_profile