# WebSocket Events Protocol - Phase 9

This document catalogs WebSocket endpoints, message schemas, and live events.

---

## 1. Connection Endpoint
- **URL Path:** `/ws/v1/{connection_type}?userId={userId}`
- **Protocols:** `ws` and `wss`
- **Supported `connection_type` Values:**
  - `chat`: Multi-user direct message channels.
  - `presence`: User active/idle status changes tracking.
  - `notifications`: Push alert delivery callbacks.
  - `collaboration`: Future live interactive IDE scopes.

---

## 2. Event Messages Payloads

### Category: `presence`
Broadcaster triggers status updates to all active sessions:
```json
{
  "userId": "student-101",
  "status": "online | offline"
}
```

### Category: `chat`
Client transfers or receives textual packet details:
- **Client Send:**
  ```json
  {
    "text": "Hello, is the mock panel open tomorrow?"
  }
  ```
- **Server Broadcast:**
  ```json
  {
    "senderId": "student-101",
    "text": "Hello, is the mock panel open tomorrow?",
    "timestamp": "2026-07-28T10:00:00Z"
  }
  ```

---

## 3. Disconnection & Offline Handling
If connection states drop:
- The backend triggers presence changes to `offline` and cleans socket dictionaries.
- The client buffers packets locally to preserve visual consistency.
