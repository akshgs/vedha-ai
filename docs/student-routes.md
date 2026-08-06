# Student Routes & Layout Hierarchy

This document outlines the routing paths, permissions authorization, and layout wrappers configuration for the Student Module.

## Routing Paths Mappings

All routing targets are lazy-loaded via React Suspense:

| Routing Endpoint | Component | Permissions Wrapper | Layout Wrapper |
| :--- | :--- | :--- | :--- |
| `/student/dashboard` | `Dashboard` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/resume` | `Resume` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/skills` | `Skills` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/coding` | `Coding` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/roadmap` | `Roadmap` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/career` | `Career` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/interview` | `Interview` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/interview/history` | `InterviewHistory` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/interview/report/:id` | `InterviewReport` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/profile` | `Profile` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/settings` | `Settings` | `ProtectedRoute role="student"` | `PortalLayout` |
| `/student/analytics` | `StudentAnalytics` | `ProtectedRoute role="student"` | `PortalLayout` |

## Protected Authorization Redirects

Role-restricted endpoints are handled in `src/routes/ProtectedRoute.tsx`. Unauthorized actions prompt automated routing redirects:
- **Role checks:** If candidate does not possess `"student"`, they are redirected to their corresponding console dashboard landing.
- **Lazy Loaders:** Page assets are dynamically code-split to optimize load performance. Suspense loads the standard `Loader` spinner during module fetch.
