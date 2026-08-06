from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

router = APIRouter(prefix="/ws/v1", tags=["Realtime WebSockets"])

class ConnectionManager:
    """Unified connection manager for Chat, Notifications, and Presence."""
    def __init__(self):
        # Maps connection_type -> set of active websockets
        self.active_connections: Dict[str, Set[WebSocket]] = {
            "chat": set(),
            "notifications": set(),
            "presence": set(),
            "collaboration": set()
        }
        # Maps user_id -> set of active websockets for direct messaging
        self.user_sockets: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, connection_type: str, user_id: str | None = None):
        await websocket.accept()
        if connection_type not in self.active_connections:
            self.active_connections[connection_type] = set()
        self.active_connections[connection_type].add(websocket)
        
        if user_id:
            if user_id not in self.user_sockets:
                self.user_sockets[user_id] = set()
            self.user_sockets[user_id].add(websocket)
            
            # Broadcast presence update
            if connection_type == "presence":
                await self.broadcast_presence(user_id, "online")

    async def disconnect(self, websocket: WebSocket, connection_type: str, user_id: str | None = None):
        if connection_type in self.active_connections and websocket in self.active_connections[connection_type]:
            self.active_connections[connection_type].remove(websocket)
            
        if user_id and user_id in self.user_sockets and websocket in self.user_sockets[user_id]:
            self.user_sockets[user_id].remove(websocket)
            if not self.user_sockets[user_id]:
                del self.user_sockets[user_id]
                
            # Broadcast presence update
            if connection_type == "presence":
                await self.broadcast_presence(user_id, "offline")

    async def send_personal_message(self, message: str | dict, user_id: str):
        if user_id in self.user_sockets:
            msg_str = json.dumps(message) if isinstance(message, dict) else message
            for socket in self.user_sockets[user_id]:
                try:
                    await socket.send_text(msg_str)
                except Exception:
                    pass

    async def broadcast(self, message: str | dict, connection_type: str):
        if connection_type in self.active_connections:
            msg_str = json.dumps(message) if isinstance(message, dict) else message
            for socket in self.active_connections[connection_type]:
                try:
                    await socket.send_text(msg_str)
                except Exception:
                    pass

    async def broadcast_presence(self, user_id: str, status: str):
        payload = {
            "userId": user_id,
            "status": status
        }
        await self.broadcast(payload, "presence")

manager = ConnectionManager()


@router.websocket("/chat/{conversation_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    conversation_id: str,
    userId: str | None = None
):
    u_id = userId or f"anon-{id(websocket)}"
    room_type = f"chat_{conversation_id}"
    await manager.connect(websocket, room_type, u_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
            except Exception:
                message = {"text": data}
                
            # Broadcast the chat packet to the specific conversation room
            from datetime import datetime
            await manager.broadcast({
                "id": f"msg-{id(websocket)}-{int(datetime.utcnow().timestamp())}",
                "senderId": u_id,
                "text": message.get("text") or message.get("message") or "",
                "timestamp": datetime.utcnow().isoformat(),
                "read": False
            }, room_type)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, room_type, u_id)
    except Exception:
        await manager.disconnect(websocket, room_type, u_id)


@router.websocket("/{connection_type}")
async def websocket_endpoint(
    websocket: WebSocket,
    connection_type: str,
    userId: str | None = None
):
    """
    Unified WebSocket entry point supporting multiple client pathways.
    """
    if connection_type not in ["chat", "notifications", "presence", "collaboration"]:
        await websocket.close(code=4000, reason="Invalid connection type")
        return

    # If userId not provided, assign a temporary anonymous one
    u_id = userId or f"anon-{id(websocket)}"
    
    await manager.connect(websocket, connection_type, u_id)
    
    try:
        while True:
            # Maintain connection, listen for messages
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
            except Exception:
                message = {"text": data}
                
            # Process packet depending on connection type
            if connection_type == "chat":
                # echo back or broadcast
                await manager.broadcast({
                    "senderId": u_id,
                    "text": message.get("text") or message.get("message") or "",
                    "timestamp": json.dumps(str(message.get("timestamp") or ""))
                }, "chat")
            elif connection_type == "presence":
                status = message.get("status", "online")
                await manager.broadcast_presence(u_id, status)
            elif connection_type == "notifications":
                # handle notification acknowledgements
                pass
    except WebSocketDisconnect:
        await manager.disconnect(websocket, connection_type, u_id)
    except Exception:
        await manager.disconnect(websocket, connection_type, u_id)

