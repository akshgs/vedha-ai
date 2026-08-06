from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.security.jwt import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/employee",
    tags=["Employee Portal"],
)

def require_employee(user: User = Depends(get_current_user)):
    if user.role not in ["employee", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employee or admin accounts can access employee portal resources.",
        )
    return user

# =========================
# Schemas
# =========================

class EmployeeDashboardStats(BaseModel):
    mentoringHours: int
    resumesReviewed: int
    mockInterviewsScheduled: int
    blogEngagement: int

class BlogPostResponse(BaseModel):
    id: int
    title: str
    category: str
    content: str
    author: str
    likes: int
    views: int
    createdAt: str

class BlogPostCreate(BaseModel):
    title: str
    category: str
    content: str

class ResumeReviewResponse(BaseModel):
    id: int
    studentName: str
    targetRole: str
    resumeFilename: str
    submittedAt: str
    status: str  # "Pending" | "Reviewed"
    comments: Optional[str] = None
    rating: Optional[int] = None

class ResumeReviewUpdate(BaseModel):
    comments: str
    rating: int

class MentorshipSlotResponse(BaseModel):
    id: int
    studentName: Optional[str] = None
    dateTime: str
    status: str  # "Available" | "Booked"
    topic: Optional[str] = None

class MentorshipSlotCreate(BaseModel):
    dateTime: str

class InterviewInviteResponse(BaseModel):
    id: int
    studentName: str
    role: str
    dateTime: str
    status: str  # "Pending" | "Accepted" | "Completed" | "Declined"
    notes: Optional[str] = None

class InterviewInviteUpdate(BaseModel):
    status: str

class ForumPostResponse(BaseModel):
    id: int
    author: str
    role: str
    content: str
    likes: int
    replies: int
    timestamp: str

class ForumPostCreate(BaseModel):
    content: str

# =========================
# In-Memory State
# =========================

MOCK_BLOG_POSTS = [
    {
        "id": 1,
        "title": "Mastering FastAPI Dependency Injection",
        "category": "Backend Development",
        "content": "Dependency Injection in FastAPI is a powerful system that makes it easy to integrate database sessions, security credentials, and helper utilities. In this guide, we dive deep into yield dependencies and sub-dependencies.",
        "author": "Akash Patel",
        "likes": 42,
        "views": 310,
        "createdAt": "2026-07-20",
    },
    {
        "id": 2,
        "title": "Clean React Architecture in Vite Projects",
        "category": "Frontend Design",
        "content": "Organizing your Vite React application with explicit layout wrappers, reusable component directories, and structured context providers ensures maintainability. Let's look at directory layouts that scale.",
        "author": "John Doe",
        "likes": 29,
        "views": 185,
        "createdAt": "2026-07-22",
    },
]

MOCK_RESUME_REVIEWS = [
    {
        "id": 1,
        "studentName": "Pranav M.",
        "targetRole": "Backend Engineer",
        "resumeFilename": "pranav_resume_backend.pdf",
        "submittedAt": "2026-07-24",
        "status": "Pending",
        "comments": None,
        "rating": None,
    },
    {
        "id": 2,
        "studentName": "Shruti S.",
        "targetRole": "Frontend Developer",
        "resumeFilename": "shruti_resume_fe.pdf",
        "submittedAt": "2026-07-23",
        "status": "Pending",
        "comments": None,
        "rating": None,
    },
    {
        "id": 3,
        "studentName": "Rahul K.",
        "targetRole": "DevOps Engineer",
        "resumeFilename": "rahul_devops.pdf",
        "submittedAt": "2026-07-21",
        "status": "Reviewed",
        "comments": "Solid Docker skills, needs more AWS description.",
        "rating": 4,
    },
]

MOCK_MENTORSHIP_SLOTS = [
    {
        "id": 1,
        "studentName": None,
        "dateTime": "2026-07-27 15:00",
        "status": "Available",
        "topic": None,
    },
    {
        "id": 2,
        "studentName": "Pranav M.",
        "dateTime": "2026-07-28 10:30",
        "status": "Booked",
        "topic": "FastAPI Optimization Tips",
    },
]

MOCK_INTERVIEW_INVITES = [
    {
        "id": 1,
        "studentName": "Pranav M.",
        "role": "Backend Engineer",
        "dateTime": "2026-07-29 16:00",
        "status": "Pending",
        "notes": "Evaluation on concurrent execution workflows.",
    },
    {
        "id": 2,
        "studentName": "Shruti S.",
        "role": "React Architect",
        "dateTime": "2026-07-30 11:00",
        "status": "Accepted",
        "notes": "Portfolio review.",
    },
]

MOCK_FORUM_POSTS = [
    {
        "id": 1,
        "author": "Vikram Sen",
        "role": "DevOps Lead @ IBM",
        "content": "Is anyone else seeing high container deployment delays in the Mumbai region today?",
        "likes": 12,
        "replies": 4,
        "timestamp": "2h ago",
    },
    {
        "id": 2,
        "author": "Sonia G.",
        "role": "Staff Engineer @ Google",
        "content": "Highly recommend reading the new paper on speculative execution pathways in AI inference nodes.",
        "likes": 25,
        "replies": 2,
        "timestamp": "5h ago",
    },
]

# =========================
# Endpoints
# =========================

@router.get("/stats", response_model=EmployeeDashboardStats)
def get_stats(current_user: User = Depends(require_employee)):
    reviewed_count = sum(1 for r in MOCK_RESUME_REVIEWS if r["status"] == "Reviewed")
    booked_count = sum(1 for s in MOCK_MENTORSHIP_SLOTS if s["status"] == "Booked")
    return {
        "mentoringHours": 12 + booked_count * 2,
        "resumesReviewed": reviewed_count + 15,
        "mockInterviewsScheduled": len(MOCK_INTERVIEW_INVITES),
        "blogEngagement": sum(b["views"] for b in MOCK_BLOG_POSTS) + 500,
    }

@router.get("/blogs", response_model=List[BlogPostResponse])
def get_blogs(current_user: User = Depends(require_employee)):
    return MOCK_BLOG_POSTS

@router.post("/blogs", response_model=BlogPostResponse)
def create_blog(data: BlogPostCreate, current_user: User = Depends(require_employee)):
    new_blog = {
        "id": len(MOCK_BLOG_POSTS) + 1,
        "title": data.title,
        "category": data.category,
        "content": data.content,
        "author": current_user.name,
        "likes": 0,
        "views": 1,
        "createdAt": datetime.utcnow().strftime("%Y-%m-%d"),
    }
    MOCK_BLOG_POSTS.insert(0, new_blog)
    return new_blog

@router.get("/resume-reviews", response_model=List[ResumeReviewResponse])
def get_resume_reviews(current_user: User = Depends(require_employee)):
    return MOCK_RESUME_REVIEWS

@router.post("/resume-reviews/{review_id}")
def submit_review(review_id: int, data: ResumeReviewUpdate, current_user: User = Depends(require_employee)):
    for r in MOCK_RESUME_REVIEWS:
        if r["id"] == review_id:
            r["status"] = "Reviewed"
            r["comments"] = data.comments
            r["rating"] = data.rating
            return {"message": "Review submitted successfully."}
    raise HTTPException(status_code=404, detail="Review request not found.")

@router.get("/mentorship/slots", response_model=List[MentorshipSlotResponse])
def get_mentorship_slots(current_user: User = Depends(require_employee)):
    return MOCK_MENTORSHIP_SLOTS

@router.post("/mentorship/slots", response_model=MentorshipSlotResponse)
def add_mentorship_slot(data: MentorshipSlotCreate, current_user: User = Depends(require_employee)):
    new_slot = {
        "id": len(MOCK_MENTORSHIP_SLOTS) + 1,
        "studentName": None,
        "dateTime": data.dateTime,
        "status": "Available",
        "topic": None,
    }
    MOCK_MENTORSHIP_SLOTS.append(new_slot)
    return new_slot

@router.get("/interviews", response_model=List[InterviewInviteResponse])
def get_interviews(current_user: User = Depends(require_employee)):
    return MOCK_INTERVIEW_INVITES

@router.put("/interviews/{invite_id}")
def update_interview(invite_id: int, data: InterviewInviteUpdate, current_user: User = Depends(require_employee)):
    for invite in MOCK_INTERVIEW_INVITES:
        if invite["id"] == invite_id:
            invite["status"] = data.status
            return {"message": "Interview invitation updated successfully."}
    raise HTTPException(status_code=404, detail="Interview invitation not found.")

@router.get("/community/forum", response_model=List[ForumPostResponse])
def get_forum_posts(current_user: User = Depends(require_employee)):
    return MOCK_FORUM_POSTS

@router.post("/community/forum", response_model=ForumPostResponse)
def publish_forum_post(data: ForumPostCreate, current_user: User = Depends(require_employee)):
    new_post = {
        "id": len(MOCK_FORUM_POSTS) + 1,
        "author": current_user.name,
        "role": f"{current_user.role.title()} @ Vedha AI",
        "content": data.content,
        "likes": 0,
        "replies": 0,
        "timestamp": "Just now",
    }
    MOCK_FORUM_POSTS.insert(0, new_post)
    return new_post
