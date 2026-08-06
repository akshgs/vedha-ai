# Database Schemas Documentation - Phase 9

This document details the relational database schema, tables, indices, and constraints.

---

## 1. Coding Platform Schema

### Table: `problems`
- `id` (INT, Primary Key)
- `title` (VARCHAR(200), Unique, Not Null)
- `slug` (VARCHAR(200), Unique, Not Null, Index)
- `description` (TEXT, Not Null)
- `difficulty` (VARCHAR(10), Default "medium", Comment: easy | medium | hard)
- `tags` (TEXT, JSON string)
- `examples` (TEXT, JSON string)
- `constraints` (TEXT)
- `hints` (TEXT, JSON string)
- `starter_code` (TEXT, JSON string)
- `solution` (TEXT)
- `editorial` (TEXT)
- `is_premium` (BOOLEAN, Default False)
- `is_active` (BOOLEAN, Default True)
- `acceptance_rate` (INT)
- `total_submissions` (INT, Default 0)
- `total_accepted` (INT, Default 0)

### Table: `submissions`
- `id` (INT, Primary Key)
- `user_id` (INT, ForeignKey users.id, Cascade, Index)
- `problem_id` (INT, ForeignKey problems.id, Cascade, Index)
- `language` (VARCHAR(30), Not Null)
- `code` (TEXT, Not Null)
- `verdict` (VARCHAR(50), Default "pending", Comment: accepted | wrong_answer | runtime_error | compilation_error | pending)
- `runtime_ms` (INT)
- `memory_kb` (INT)
- `test_cases_passed` (INT)
- `total_test_cases` (INT)
- `error_log` (TEXT)
- `is_contest_submission` (BOOLEAN, Default False)
- `created_at` (DATETIME, Default utcnow, Index)

---

## 2. Learning Engine Schema

### Table: `courses`
- `id` (INT, Primary Key)
- `title` (VARCHAR(200), Not Null)
- `category` (VARCHAR(100), Not Null)
- `provider` (VARCHAR(150), Not Null)
- `duration` (VARCHAR(50), Not Null)
- `level` (VARCHAR(50), Not Null)
- `description` (TEXT)
- `is_active` (BOOLEAN, Default True)
- `created_at` (DATETIME)

### Table: `lessons`
- `id` (INT, Primary Key)
- `course_id` (INT, ForeignKey courses.id, Cascade, Index)
- `title` (VARCHAR(200), Not Null)
- `video_url` (VARCHAR(500), Not Null)
- `duration` (VARCHAR(50), Not Null)
- `notes` (TEXT)
- `is_active` (BOOLEAN, Default True)

---

## 3. Human Recruitment Schema

### Table: `recruitment_interview_slots`
- `id` (INT, Primary Key)
- `company_job_id` (INT, ForeignKey company_jobs.id, Cascade, Index)
- `candidate_id` (INT, ForeignKey users.id, Nullable, Index)
- `date` (VARCHAR(50), Not Null)
- `time` (VARCHAR(50), Not Null)
- `interviewer_name` (VARCHAR(100), Not Null)
- `status` (VARCHAR(50), Default "available") # available | booked | cancelled
- `details` (TEXT)

### Table: `recruitment_offers`
- `id` (INT, Primary Key)
- `company_job_id` (INT, ForeignKey company_jobs.id, Cascade, Index)
- `student_id` (INT, ForeignKey users.id, Cascade, Index)
- `salary` (VARCHAR(100), Not Null)
- `deadline` (VARCHAR(50), Not Null)
- `status` (VARCHAR(50), Default "Pending") # Pending | Accepted | Declined
