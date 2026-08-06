# Learning Engine Platform

This document describes the design, decoupling, and mechanics of the reusable learning engine.

---

## 1. Decoupled Components Design

The pages are completely decoupled to improve load performance and ensure ease of maintainability:

1. **Course Catalog (`Catalog.tsx`):** Handles categories browsing, catalog listings, recommendations, and bookmarks state.
2. **Course Details (`Details.tsx`):** Coordinates syllabus, assignment submissions status, and quiz evaluations.
3. **Lesson Player (`Lesson.tsx`):** Embeds video playlist tracks, logs study notes drawers, and loads active lesson discussions threads.

---

## 2. Progress Tracker Calculations

Lesson completions trigger an asynchronous state check:
- Completed lesson counts are evaluated against the total index.
- Progression percentages are written dynamically to the database.
- 100% completions automatically unlock the verified credentials exporter.

---

## 3. Quizzes & Submissions Evaluations

- Quizzes evaluate student answers dynamically, and success states release corresponding XP points to the leaderboard.
- Assignments support code file uploads with loading, success, and error feedback states.
