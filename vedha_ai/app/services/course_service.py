from sqlalchemy.orm import Session
from app.repositories.course_repository import CourseRepository

class CourseService:
    @staticmethod
    def get_catalog(db: Session, user_id: int) -> list[dict]:
        repo = CourseRepository(db)
        return repo.get_all_courses(user_id)

    @staticmethod
    def get_details(db: Session, course_id: int, user_id: int) -> dict:
        repo = CourseRepository(db)
        details = repo.get_course_details(course_id, user_id)
        return details

    @staticmethod
    def update_progress(db: Session, user_id: int, course_id: int, lesson_id: int, completed: bool) -> None:
        repo = CourseRepository(db)
        repo.update_lesson_progress(user_id, course_id, lesson_id, completed)

    @staticmethod
    def toggle_bookmark(db: Session, user_id: int, course_id: int) -> bool:
        repo = CourseRepository(db)
        return repo.toggle_bookmark(user_id, course_id)

    @staticmethod
    def get_discussions(db: Session, course_id: int) -> list[dict]:
        repo = CourseRepository(db)
        return repo.get_discussion_threads(course_id)

    @staticmethod
    def post_comment(db: Session, course_id: int, user_id: int, author_name: str, text: str) -> dict:
        repo = CourseRepository(db)
        return repo.add_discussion_comment(course_id, user_id, author_name, text)
