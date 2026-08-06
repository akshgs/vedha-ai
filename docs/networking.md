# Professional Network Module

This document outlines the architecture, components, and services governing the Collaboration Feed, Connections, and Community Groups within Vedha AI.

---

## 1. Directory Structure

```
src/
 ├── services/
 │    └── networking.ts       # Feed posts, connection actions, and searches APIs
 └── components/ui/collaboration/
      ├── ProfileCard.tsx     # Preview bios card
      ├── ProfileHeader.tsx   # Verified header and follow actions
      ├── ProfileTimeline.tsx # Timeline history logs
      ├── ConnectionCard.tsx  # Followers listing items
      ├── FollowButton.tsx    # Connection updates button toggle
      ├── PostCard.tsx        # Feed updates container
      ├── PostComposer.tsx    # Updates composition textarea
      ├── CommentThread.tsx   # Nested collapsible comment lists
      ├── ReactionBar.tsx     # Reactions panel
      ├── ShareDialog.tsx     # Clipboard sharing popup
      ├── CommunityCard.tsx   # Group detail preview
      ├── SearchResults.tsx   # Global queries directory list
      └── FilterPanel.tsx     # Query parameters selects panel
```

---

## 2. Shared Profiles Concept

All roles (Students, Employees, Mentors, Recruiters, and Universities) share a single, unified database schema mapping connection channels. No duplication exists:
- Followers statistics are retrieved dynamically.
- Public profiles display badges, expertise indices, and history timelines.

---

## 3. Global Query Search Listings

- Users submit search keywords triggering `queryGlobalNetwork(query)`.
- Reusable `SearchResults` lists matching connections and community groups, using the same components across all dashboard portals.
