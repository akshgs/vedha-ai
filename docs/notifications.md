# Unified Notification System

This document outlines the design and endpoints for the centralized notification ledger of Vedha AI.

---

## 1. Alert Types & Mappings

```
                    ┌────────────────────────┐
                    │  Notification Service  │
                    └───────────┬────────────┘
                                │
        ┌───────────────┬───────┴───────┬───────────────┐
        ▼               ▼               ▼               ▼
   [Message]      [Connection]     [Mentorship]    [System alert]
```

All connection alerts, message alerts, booking approvals, and system broadcasts route through: `services/notifications.ts`.

---

## 2. Reading Status Transitions

- Triggering a click on `NotificationCard` invokes `markNotificationRead(id)`.
- Updates visually fade the card boundary and decrease the active unread counter badge.
- Support is provided for `markAllNotificationsRead()` to clear all items in the inbox.
