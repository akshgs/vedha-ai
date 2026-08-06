# Realtime WebSockets Integration

This document outlines the socket hooks design, message schemas, and state listeners configured for live notifications and active presence.

---

## 1. WebSocket Hook Directory

WebSockets are controlled via reusable react hooks:

1. **`useChatSocket(conversationId)`:** Listens for real-time text packets.
2. **`useNotificationSocket()`:** Alerts connection updates or bookings.
3. **`usePresenceSocket(userId)`:** Broadcasts user online status.

---

## 2. Packet Specifications

### Chat message JSON:
```json
{
  "text": "Hello, are you available tomorrow?",
  "timestamp": "2026-07-25T10:30:00Z"
}
```

### Presence update JSON:
```json
{
  "userId": "mentor-1",
  "status": "online"
}
```

---

## 3. Offline Graceful Fallback

If WebSocket connections fail:
- Hooks capture failures and update connectivity state displays to "closed".
- Message sends automatically log variables inside local arrays.
- Renders simulated responses to preserve platform interactivity.
