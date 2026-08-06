# Application Timeline Subsystem

This document explains the stage timeline indicators for sent job applications.

---

## 1. Application Timeline Steps

Each application displays a progressive timeline mapping five milestones:

```
[Resume Sent] ──► [Screening Review] ──► [Interviews Scheduled] ──► [Offer Letter] ──► [Hired Placement]
```

- Reusable `Timeline` component tracks status updates.
- Resume uploads are dispatched to `/recruitment/jobs/:id/apply`.
