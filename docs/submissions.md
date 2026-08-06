# Solutions Submissions Subsystem

This document outlines how code submission records are tracked.

---

## 1. Submission Schema

```typescript
export interface Submission {
  id: number;
  problemId: number;
  problemTitle: string;
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error";
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
  code: string;
}
```

- Submissions list displays history blocks of code.
- Status values color-code the outcome logs.
- Code blocks are stored inside read-only scrollable textareas.
