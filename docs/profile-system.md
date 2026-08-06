# Unified Profile System

This document outlines the profile database schemas, shared layout grids, and follower connection models of Vedha AI.

---

## 1. Unified Profile Schema

Every role (Students, Employees, Mentors, Recruiters, and Companies) queries the same profile registry system:

```typescript
export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
  skills: string[];
  experiences: { title: string; company: string; duration: string }[];
  badges: string[];
}
```

- Public profile views use `ProfileHeader` and `ProfileTimeline` components.
- Direct messaging controls bind profiles to inbox channels.

---

## 2. Connections & Followers Mappings

- Connection requests are initiated via `toggleConnectUser()`.
- Followers indexes are updated via `toggleFollowUser()`, sync'ing the visual status metrics on profiles dynamically.
