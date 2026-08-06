from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.security.jwt import get_current_user
from app.models.mentorship import MentorProfile, MentorBookingSlot, MentorshipSession, MentorReview
from app.models.user import User
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/mentorship", tags=["Mentorship"])

class BookSessionPayload(BaseModel):
    slotId: str
    goalText: str

class MentorReviewPayload(BaseModel):
    rating: int
    text: str

from app.models.roadmap import Roadmap
import json

@router.get("/match")
def get_matched_mentors(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Query latest roadmap to extract missing skills
    roadmap = db.query(Roadmap).filter(Roadmap.student_id == current_user.id).order_by(Roadmap.created_at.desc()).first()
    missing_skills = []
    if roadmap:
        try:
            roadmap_data = json.loads(roadmap.roadmap_json)
            missing_skills = [s.strip().lower() for s in roadmap_data.get("missing_skills", [])]
        except Exception:
            pass

    # 2. Query all mentor profiles
    profiles = db.query(MentorProfile).join(User).all()
    res = []
    
    for p in profiles:
        skills_list = [s.strip() for s in p.skills.split(",") if s.strip()]
        
        # Calculate overlap score
        matches = []
        for s in skills_list:
            if s.strip().lower() in missing_skills:
                matches.append(s.strip())
        
        match_score = len(matches)
        
        res.append({
            "id": f"mentor-{p.user_id}",
            "name": p.user.name,
            "avatar": "",
            "role": p.user.role.capitalize() if p.user.role else "Employee Mentor",
            "company": p.company,
            "rating": p.rating,
            "reviewsCount": p.reviews_count,
            "skills": skills_list,
            "bio": p.bio,
            "matchScore": match_score,
            "matchedSkills": matches
        })
        
    # Sort by matchScore desc
    res.sort(key=lambda x: x["matchScore"], reverse=True)
    return res

@router.get("/mentors")
def get_mentors_list(
    skill: Optional[str] = Query(default=None),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(MentorProfile).join(User)
    if skill:
        query = query.filter(MentorProfile.skills.ilike(f"%{skill}%"))
    
    profiles = query.all()
    res = []
    for p in profiles:
        skills_list = [s.strip() for s in p.skills.split(",") if s.strip()]
        res.append({
            "id": f"mentor-{p.user_id}",
            "name": p.user.name,
            "avatar": "",
            "role": p.user.role.capitalize() if p.user.role else "Employee Mentor",
            "company": p.company,
            "rating": p.rating,
            "reviewsCount": p.reviews_count,
            "skills": skills_list,
            "bio": p.bio
        })
    return res

@router.get("/mentors/{mentor_id}/slots")
def get_mentor_slots(
    mentor_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    m_id = int(mentor_id.replace("mentor-", ""))
    slots = db.query(MentorBookingSlot).filter(
        MentorBookingSlot.mentor_id == m_id,
        MentorBookingSlot.booked == False
    ).all()
    
    res = []
    for s in slots:
        res.append({
            "id": f"slot-{s.id}",
            "date": s.date,
            "time": s.time,
            "booked": s.booked
        })
    return res

@router.post("/mentors/{mentor_id}/book")
def book_session(
    mentor_id: str,
    payload: BookSessionPayload,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    m_id = int(mentor_id.replace("mentor-", ""))
    slot_id_int = int(payload.slotId.replace("slot-", ""))
    
    slot = db.query(MentorBookingSlot).filter(MentorBookingSlot.id == slot_id_int).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
        
    if slot.booked:
        raise HTTPException(status_code=400, detail="Slot already booked")
        
    slot.booked = True
    
    mentor_user = db.query(User).filter(User.id == m_id).first()
    m_name = mentor_user.name if mentor_user else "Mentor"
    
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == m_id).first()
    m_company = profile.company if profile else "Ecosystem Partner"
    
    session = MentorshipSession(
        student_id=current_user.id,
        mentor_id=m_id,
        date=slot.date,
        time=slot.time,
        status="Scheduled",
        goal=payload.goalText
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return {
        "id": f"sess-{session.id}",
        "mentorName": m_name,
        "role": m_company,
        "date": session.date,
        "time": session.time,
        "status": session.status,
        "goal": session.goal
    }

@router.get("/sessions")
def get_sessions_list(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(MentorshipSession).filter(
        MentorshipSession.student_id == current_user.id
    ).all()
    
    res = []
    for s in sessions:
        mentor_user = db.query(User).filter(User.id == s.mentor_id).first()
        m_name = mentor_user.name if mentor_user else "Mentor"
        
        profile = db.query(MentorProfile).filter(MentorProfile.user_id == s.mentor_id).first()
        m_company = profile.company if profile else "Ecosystem Partner"
        
        res.append({
            "id": f"sess-{s.id}",
            "mentorName": m_name,
            "role": m_company,
            "date": s.date,
            "time": s.time,
            "status": s.status,
            "notes": s.notes,
            "goal": s.goal
        })
    return res

@router.post("/mentors/{mentor_id}/review")
def review_mentor(
    mentor_id: str,
    payload: MentorReviewPayload,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    m_id = int(mentor_id.replace("mentor-", ""))
    
    review = MentorReview(
        mentor_id=m_id,
        student_id=current_user.id,
        rating=payload.rating,
        text=payload.text
    )
    
    db.add(review)
    
    # Recalculate average rating
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == m_id).first()
    if profile:
        reviews = db.query(MentorReview).filter(MentorReview.mentor_id == m_id).all()
        ratings = [r.rating for r in reviews] + [payload.rating]
        profile.rating = round(sum(ratings) / len(ratings), 1)
        profile.reviews_count = len(ratings)
        
    db.commit()
    return {"message": "Review submitted successfully"}
