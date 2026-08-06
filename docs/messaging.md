# Messaging Subsystem Specifications

This document catalogs the direct chat client design, message payloads, search indexing, and thread caching policies.

---

## 1. Unified Message Schema

All messaging features are bound to a single schema mapping conversations:

```typescript
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  fileUrl?: string;
}
```

- **Attachments:** Supported via file upload link vectors.
- **Read Receipts:** Tracked using the boolean `read` indicator.

---

## 2. Conversation Archive Engine

- Archive requests invoke `archiveConversation(id)` which writes archive status values to the database.
- Archived threads are hidden from the active Inbox list, minimizing feed sizes.

---

## 3. History Search Optimization

- Messages search queries invoke `/messages/search?q=...` directly.
- The UI filters active items using regex matches, preventing redundant API calls.
