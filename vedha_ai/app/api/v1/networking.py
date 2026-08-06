from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.security.jwt import get_current_user
from app.models.networking import Post, PostLike, Community, CommunityMember, UserConnection
from app.models.user import User
from app.models.profile import Profile
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/networking", tags=["Networking"])
profiles_router = APIRouter(prefix="/profiles", tags=["Profiles Connections"])

class PostCreatePayload(BaseModel):
    text: str

class PostResponse(BaseModel):
    id: str
    author: dict
    text: str
    likes: int
    commentsCount: int
    liked: bool
    saved: bool
    timestamp: str

# ── Profiles & Connections ──────────────────────────────────────────────────

@profiles_router.get("/{user_id}")
def get_user_profile(
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Try parsing user_id as int or query by email/name
    try:
        u_id = int(user_id)
        user = db.query(User).filter(User.id == u_id).first()
    except ValueError:
        user = db.query(User).filter(User.email == user_id).first()

    if not user:
        # Fallback to a mock/temporary student details if user not found in DB
        return {
            "id": user_id,
            "name": "Ecosystem Member",
            "role": "student",
            "avatar": "",
            "bio": "AI engineering practitioner.",
            "connectionsCount": 15,
            "followersCount": 42,
            "followingCount": 38,
            "skills": ["Python", "FastAPI"],
            "experiences": [],
            "badges": [],
            "followed": False,
            "connected": False
        }

    # Fetch follow & connection status
    followed = db.query(UserConnection).filter(
        UserConnection.user_id == current_user.id,
        UserConnection.target_id == user.id,
        UserConnection.connection_type == "follow"
    ).count() > 0

    connected = db.query(UserConnection).filter(
        UserConnection.user_id == current_user.id,
        UserConnection.target_id == user.id,
        UserConnection.connection_type == "connect"
    ).count() > 0

    # Get user profile or create mock
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    bio = profile.bio if (profile and profile.bio) else "Deep learning practitioner and coding enthusiast."
    skills = [s.strip() for s in (profile.skills.split(",") if (profile and profile.skills) else ["Python", "FastAPI", "React"])]

    return {
        "id": str(user.id),
        "name": user.name,
        "role": user.role,
        "avatar": "",
        "bio": bio,
        "connectionsCount": 120,
        "followersCount": 450,
        "followingCount": 210,
        "skills": skills,
        "experiences": [],
        "badges": ["Top Performer"] if user.role == "student" else ["Ecosystem Mentor"],
        "followed": followed,
        "connected": connected
    }

@profiles_router.post("/{user_id}/follow")
def follow_user(
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        target_id = int(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid target user id")

    existing = db.query(UserConnection).filter(
        UserConnection.user_id == current_user.id,
        UserConnection.target_id == target_id,
        UserConnection.connection_type == "follow"
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"followed": False}
    else:
        conn = UserConnection(user_id=current_user.id, target_id=target_id, connection_type="follow")
        db.add(conn)
        db.commit()
        return {"followed": True}

@profiles_router.post("/{user_id}/connect")
def connect_user(
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        target_id = int(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid target user id")

    existing = db.query(UserConnection).filter(
        UserConnection.user_id == current_user.id,
        UserConnection.target_id == target_id,
        UserConnection.connection_type == "connect"
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"connected": False}
    else:
        conn = UserConnection(user_id=current_user.id, target_id=target_id, connection_type="connect")
        db.add(conn)
        db.commit()
        return {"connected": True}


# ── News Feed ───────────────────────────────────────────────────────────────

@router.get("/feed", response_model=List[PostResponse])
def get_feed(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    feed = []
    for p in posts:
        # Check if liked by current user
        liked = db.query(PostLike).filter(PostLike.post_id == p.id, PostLike.user_id == current_user.id).count() > 0
        
        feed.append({
            "id": f"post-{p.id}",
            "author": {
                "id": str(p.author.id),
                "name": p.author.name,
                "avatar": "",
                "role": p.author.role.capitalize()
            },
            "text": p.text,
            "likes": p.likes_count,
            "commentsCount": p.comments_count,
            "liked": liked,
            "saved": False,
            "timestamp": "Just now" if (datetime.utcnow() - p.created_at).seconds < 60 else f"{(datetime.utcnow() - p.created_at).seconds // 3600} hours ago"
        })
    return feed

@router.post("/feed", response_model=PostResponse)
def create_post(
    payload: PostCreatePayload,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    p = Post(author_id=current_user.id, text=payload.text)
    db.add(p)
    db.commit()
    db.refresh(p)
    return {
        "id": f"post-{p.id}",
        "author": {
            "id": str(current_user.id),
            "name": current_user.name,
            "avatar": "",
            "role": current_user.role.capitalize()
        },
        "text": p.text,
        "likes": 0,
        "commentsCount": 0,
        "liked": False,
        "saved": False,
        "timestamp": "Just now"
    }

@router.post("/feed/{post_id}/like")
def like_post(
    post_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    p_id = int(post_id.replace("post-", ""))
    post = db.query(Post).filter(Post.id == p_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = db.query(PostLike).filter(PostLike.post_id == p_id, PostLike.user_id == current_user.id).first()
    if existing:
        db.delete(existing)
        if post.likes_count > 0:
            post.likes_count -= 1
        db.commit()
        return {"liked": False}
    else:
        like = PostLike(post_id=p_id, user_id=current_user.id)
        db.add(like)
        post.likes_count += 1
        db.commit()
        return {"liked": True}


# ── Communities ─────────────────────────────────────────────────────────────

@router.get("/communities")
def get_communities_list(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    communities = db.query(Community).all()
    res = []
    for c in communities:
        joined = db.query(CommunityMember).filter(
            CommunityMember.community_id == c.id,
            CommunityMember.user_id == current_user.id
        ).count() > 0
        res.append({
            "id": f"group-{c.id}",
            "name": c.name,
            "description": c.description,
            "membersCount": c.members_count,
            "joined": joined
        })
    return res

@router.post("/communities/{id}/join")
def join_community(
    id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c_id = int(id.replace("group-", ""))
    community = db.query(Community).filter(Community.id == c_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")

    existing = db.query(CommunityMember).filter(
        CommunityMember.community_id == c_id,
        CommunityMember.user_id == current_user.id
    ).first()

    if existing:
        db.delete(existing)
        if community.members_count > 0:
            community.members_count -= 1
        db.commit()
        return {"joined": False}
    else:
        member = CommunityMember(community_id=c_id, user_id=current_user.id)
        db.add(member)
        community.members_count += 1
        db.commit()
        return {"joined": True}

@router.get("/search")
def search_network(
    q: str = Query(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Query users matching query string
    users = db.query(User).filter(User.name.ilike(f"%{q}%"), User.role == "student").all()
    groups = db.query(Community).filter(Community.name.ilike(f"%{q}%")).all()

    users_res = []
    for u in users:
        users_res.append({
            "id": str(u.id),
            "name": u.name,
            "role": u.role,
            "avatar": "",
            "bio": "AI Developer Ecosystem Member",
            "connectionsCount": 24,
            "followersCount": 85,
            "followingCount": 40,
            "skills": ["Python", "FastAPI"],
            "experiences": [],
            "badges": [],
            "followed": False,
            "connected": False
        })

    groups_res = []
    for g in groups:
        joined = db.query(CommunityMember).filter(
            CommunityMember.community_id == g.id,
            CommunityMember.user_id == current_user.id
        ).count() > 0
        groups_res.append({
            "id": f"group-{g.id}",
            "name": g.name,
            "description": g.description,
            "membersCount": g.members_count,
            "joined": joined
        })

    return {
        "users": users_res,
        "groups": groups_res
    }
