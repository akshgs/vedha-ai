from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.database import get_db
from app.security.jwt import get_current_user
from app.models.messages import Conversation as DBConversation, DirectMessage
from app.models.user import User
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["Messaging"])

class SendMessagePayload(BaseModel):
    text: str
    fileUrl: Optional[str] = None

class CreateConversationPayload(BaseModel):
    recipientId: int

@router.get("/conversations")
def get_conversations_list(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Query conversations where the current user is user1 or user2
    convs = db.query(DBConversation).filter(
        or_(
            DBConversation.user1_id == current_user.id,
            DBConversation.user2_id == current_user.id
        )
    ).all()
    
    # If no conversations exist, seed a default one with mentor-1 (Pranav M.)
    if not convs:
        # Check if mentor user exists
        m_user = db.query(User).filter(User.email == "pranav@test.com").first()
        if m_user and m_user.id != current_user.id:
            c = DBConversation(
                user1_id=current_user.id,
                user2_id=m_user.id,
                last_message="Welcome to Vedha Portal direct messaging! Feel free to ask me questions.",
                updated_at=datetime.utcnow()
            )
            db.add(c)
            db.commit()
            db.refresh(c)
            
            # Add starter message
            msg = DirectMessage(
                conversation_id=c.id,
                sender_id=m_user.id,
                text="Welcome to Vedha Portal direct messaging! Feel free to ask me questions.",
                read=False
            )
            db.add(msg)
            db.commit()
            convs = [c]
            
    res = []
    for c in convs:
        # Find recipient
        recipient_id = c.user2_id if c.user1_id == current_user.id else c.user1_id
        recipient = db.query(User).filter(User.id == recipient_id).first()
        if not recipient:
            continue
            
        is_archived = c.archived_by_user1 if c.user1_id == current_user.id else c.archived_by_user2
        
        # Calculate unread count
        unread = db.query(DirectMessage).filter(
            DirectMessage.conversation_id == c.id,
            DirectMessage.sender_id == recipient_id,
            DirectMessage.read == False
        ).count()
        
        res.append({
            "id": f"conv-{c.id}",
            "recipient": {
                "id": str(recipient.id),
                "name": recipient.name,
                "avatar": "",
                "presence": "online"
            },
            "lastMessage": c.last_message,
            "timestamp": "Just now",
            "unreadCount": unread,
            "archived": is_archived
        })
    return res

@router.post("/conversations")
def get_or_create_conversation(
    payload: CreateConversationPayload,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if a conversation already exists
    conv = db.query(DBConversation).filter(
        or_(
            (DBConversation.user1_id == current_user.id) & (DBConversation.user2_id == payload.recipientId),
            (DBConversation.user1_id == payload.recipientId) & (DBConversation.user2_id == current_user.id)
        )
    ).first()
    
    if not conv:
        conv = DBConversation(
            user1_id=current_user.id,
            user2_id=payload.recipientId,
            last_message="Conversation started.",
            updated_at=datetime.utcnow()
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
        
        # Add a placeholder/welcome message
        msg = DirectMessage(
            conversation_id=conv.id,
            sender_id=current_user.id,
            text="Hello! I would love to connect with you for mentorship.",
            read=False
        )
        db.add(msg)
        db.commit()

    return {
        "id": f"conv-{conv.id}",
        "recipientId": str(payload.recipientId)
    }

@router.get("/conversations/{conversation_id}")
def get_conversation_messages(
    conversation_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c_id = int(conversation_id.replace("conv-", ""))
    conv = db.query(DBConversation).filter(DBConversation.id == c_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    if conv.user1_id != current_user.id and conv.user2_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    messages = db.query(DirectMessage).filter(
        DirectMessage.conversation_id == c_id
    ).order_by(DirectMessage.created_at.asc()).all()
    
    # Mark recipient messages as read
    recipient_id = conv.user2_id if conv.user1_id == current_user.id else conv.user1_id
    db.query(DirectMessage).filter(
        DirectMessage.conversation_id == c_id,
        DirectMessage.sender_id == recipient_id,
        DirectMessage.read == False
    ).update({"read": True})
    db.commit()
    
    res = []
    for m in messages:
        res.append({
            "id": f"msg-{m.id}",
            "senderId": str(m.sender_id),
            "text": m.text,
            "timestamp": m.created_at.isoformat(),
            "read": m.read,
            "fileUrl": m.file_url
        })
    return res

@router.post("/conversations/{conversation_id}")
def send_direct_message(
    conversation_id: str,
    payload: SendMessagePayload,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c_id = int(conversation_id.replace("conv-", ""))
    conv = db.query(DBConversation).filter(DBConversation.id == c_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    if conv.user1_id != current_user.id and conv.user2_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    msg = DirectMessage(
        conversation_id=c_id,
        sender_id=current_user.id,
        text=payload.text,
        file_url=payload.fileUrl,
        read=False
    )
    db.add(msg)
    
    conv.last_message = payload.text
    conv.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(msg)
    
    return {
        "id": f"msg-{msg.id}",
        "senderId": str(msg.sender_id),
        "text": msg.text,
        "timestamp": msg.created_at.isoformat(),
        "read": msg.read,
        "fileUrl": msg.file_url
    }

@router.post("/conversations/{conversation_id}/archive")
def archive_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c_id = int(conversation_id.replace("conv-", ""))
    conv = db.query(DBConversation).filter(DBConversation.id == c_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    if conv.user1_id == current_user.id:
        conv.archived_by_user1 = True
    elif conv.user2_id == current_user.id:
        conv.archived_by_user2 = True
        
    db.commit()
    return {"message": "Conversation archived successfully"}

@router.get("/search")
def search_messages(
    q: str = Query(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(DirectMessage).join(DBConversation).filter(
        or_(
            DBConversation.user1_id == current_user.id,
            DBConversation.user2_id == current_user.id
        ),
        DirectMessage.text.ilike(f"%{q}%")
    ).all()
    
    res = []
    for m in messages:
        res.append({
            "id": f"msg-{m.id}",
            "senderId": str(m.sender_id),
            "text": m.text,
            "timestamp": m.created_at.isoformat(),
            "read": m.read,
            "fileUrl": m.file_url
        })
    return res
