from datetime import datetime
from sqlalchemy.orm import Session
from app.models.course import Course, Lesson, UserCourseProgress, CourseBookmark, CourseDiscussion
from app.models.user import User

class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _get_course_skills(course_id: int) -> list[str]:
        skills_map = {
            101: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Vite"],
            102: ["System Design", "Microservices", "REST APIs", "Kubernetes", "gRPC"],
            103: ["FastAPI", "Python", "SQL", "PostgreSQL", "ORM", "Docker"],
            104: ["AWS", "DevOps", "CI/CD", "Terraform", "Docker"]
        }
        return skills_map.get(course_id, [])

    def get_all_courses(self, user_id: int) -> list[dict]:
        courses = self.db.query(Course).filter(Course.is_active == True).all()
        result = []
        for c in courses:
            # Check bookmark status
            saved = self.db.query(CourseBookmark).filter(
                CourseBookmark.user_id == user_id,
                CourseBookmark.course_id == c.id
            ).count() > 0
            
            # Compute progress
            total_lessons = self.db.query(Lesson).filter(Lesson.course_id == c.id, Lesson.is_active == True).count()
            completed_lessons = self.db.query(UserCourseProgress).filter(
                UserCourseProgress.user_id == user_id,
                UserCourseProgress.course_id == c.id,
                UserCourseProgress.completed == True
            ).count()
            
            progress = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
            
            result.append({
                "id": c.id,
                "title": c.title,
                "category": c.category,
                "provider": c.provider,
                "duration": c.duration,
                "saved": saved,
                "progress": progress,
                "level": c.level,
                "desc": c.description,
                "skills": CourseRepository._get_course_skills(c.id)
            })
        return result

    def get_course_details(self, course_id: int, user_id: int) -> dict | None:
        course = self.db.query(Course).filter(Course.id == course_id, Course.is_active == True).first()
        if not course:
            return None
            
        lessons = self.db.query(Lesson).filter(Lesson.course_id == course_id, Lesson.is_active == True).order_by(Lesson.id).all()
        
        lesson_list = []
        for l in lessons:
            completed = self.db.query(UserCourseProgress).filter(
                UserCourseProgress.user_id == user_id,
                UserCourseProgress.course_id == course_id,
                UserCourseProgress.lesson_id == l.id,
                UserCourseProgress.completed == True
            ).count() > 0
            
            lesson_list.append({
                "id": l.id,
                "title": l.title,
                "videoUrl": l.video_url,
                "duration": l.duration,
                "notes": l.notes,
                "completed": completed
            })
            
        # Mock assignments and quizzes to align with frontend types
        # As documented in course-services.md
        assignments = [
            {"id": 11, "title": "Coding Challenge: Array manipulation", "desc": "Submit a React UI filtering an input checklist array.", "submitted": True},
            {"id": 12, "title": "Project: Building a modular custom dashboard", "desc": "Build a single page application managing re-orderable widgets.", "submitted": False}
        ]
        
        quizzes = [
            {
                "id": 21,
                "title": "Core Mechanics Quiz",
                "question": "Which pattern manages side effects cleanly inside functional elements?",
                "options": ["useState", "useEffect", "useReducer"],
                "answer": "useEffect"
            }
        ]
        
        # Calculate overall progress
        total_lessons = len(lessons)
        completed_lessons = sum(1 for l in lesson_list if l["completed"])
        progress = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
        
        saved = self.db.query(CourseBookmark).filter(
            CourseBookmark.user_id == user_id,
            CourseBookmark.course_id == course_id
        ).count() > 0
        
        return {
            "course": {
                "id": course.id,
                "title": course.title,
                "category": course.category,
                "provider": course.provider,
                "duration": course.duration,
                "saved": saved,
                "progress": progress,
                "level": course.level,
                "desc": course.description,
                "skills": CourseRepository._get_course_skills(course.id)
            },
            "lessons": lesson_list,
            "assignments": assignments,
            "quizzes": quizzes
        }

    def update_lesson_progress(self, user_id: int, course_id: int, lesson_id: int, completed: bool) -> None:
        progress = self.db.query(UserCourseProgress).filter(
            UserCourseProgress.user_id == user_id,
            UserCourseProgress.course_id == course_id,
            UserCourseProgress.lesson_id == lesson_id
        ).first()
        
        if not progress:
            progress = UserCourseProgress(
                user_id=user_id,
                course_id=course_id,
                lesson_id=lesson_id,
                completed=completed
            )
            self.db.add(progress)
        else:
            progress.completed = completed
            
        self.db.commit()

    def toggle_bookmark(self, user_id: int, course_id: int) -> bool:
        bookmark = self.db.query(CourseBookmark).filter(
            CourseBookmark.user_id == user_id,
            CourseBookmark.course_id == course_id
        ).first()
        
        if bookmark:
            self.db.delete(bookmark)
            self.db.commit()
            return False
        else:
            bookmark = CourseBookmark(user_id=user_id, course_id=course_id)
            self.db.add(bookmark)
            self.db.commit()
            return True

    def get_discussion_threads(self, course_id: int) -> list[dict]:
        threads = self.db.query(CourseDiscussion).filter(
            CourseDiscussion.course_id == course_id
        ).order_by(CourseDiscussion.created_at.asc()).all()
        
        return [
            {
                "id": t.id,
                "author": t.author_name,
                "text": t.text,
                "timestamp": "Just now" if (t.created_at.strftime('%Y-%m-%d') == datetime.utcnow().strftime('%Y-%m-%d')) else t.created_at.strftime('%Y-%m-%d')
            }
            for t in threads
        ]

    def add_discussion_comment(self, course_id: int, user_id: int, author_name: str, text: str) -> dict:
        comment = CourseDiscussion(
            course_id=course_id,
            user_id=user_id,
            author_name=author_name,
            text=text
        )
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        
        return {
            "id": comment.id,
            "author": comment.author_name,
            "text": comment.text,
            "timestamp": "Just now"
        }
