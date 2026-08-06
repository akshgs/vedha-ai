# Performance Review & Optimizations - Phase 10

This review details query execution efficiency, database constraints, caching strategies, and scaling configurations.

---

## 1. Query Execution & N+1 Mitigations

### N+1 Query Auditing
When loading structured catalogs (e.g. applications lists or courses details), querying related tables sequentially creates significant latency.
- **Resolution:** We utilize SQLAlchemy's `joinedload` strategy to fetch relationships in a single database JOIN query:
  - `ApplicationRepository` uses `joinedload(Application.job)` and `joinedload(Application.student)`.
  - `RecruitmentRepository` uses `joinedload(Application.job).joinedload(CompanyJob.company)`.
  This optimization reduces query counts from $O(N)$ database roundtrips to exactly $1$.

### Paginated Retrievals
All listing endpoints implement pagination using `limit` and `offset` constraints to prevent buffer overflows:
- `ProblemRepository.get_all` (defaults to 20 per page).
- `SubmissionRepository.get_by_user` (defaults to 20 per page).
- `NotificationRepository.get_by_user` (defaults to 30 per page).

---

## 2. Index Structures and Database Schemas

To ensure fast query response times under high concurrency, indexes are defined on all frequently searched foreign key columns:
- **`users`:** `email` (Unique index)
- **`profiles`:** `user_id` (Unique index)
- **`submissions`:** `user_id` (Index), `problem_id` (Index), `created_at` (Index)
- **`problems`:** `slug` (Unique index)
- **`notifications`:** `user_id` (Index), `created_at` (Index)
- **`recruitment_interview_slots`:** `company_job_id` (Index), `candidate_id` (Index)
- **`recruitment_offers`:** `company_job_id` (Index), `student_id` (Index)

---

## 3. Caching & Scaling Configurations

### Redis Cache Integration
Redis cache stores are recommended to optimize performance for high-load, read-heavy query states:
1. **Coding Leaderboard:** Cached for 5 minutes (`GET /coding/leaderboard`). High-frequency pagination calculations bypass database queries entirely.
2. **Dashboard Statistics:** Streak metrics are cached for 1 hour (`GET /coding/stats`), updating only upon successful code submissions.

### Background Tasks Allocation
Heavy workloads are offloaded to background threads using FastAPI's `BackgroundTasks`:
- Audit logs execution: `AIHistoryRepository.log()` tasks are spawned in the background, allowing endpoint responses to return immediately.
- Notification pushes: Triggers notifications dispatch asynchronously, preventing user action blocking.

### WebSocket Scalability (Redis Pub/Sub)
Standard WebSocket connection managers operate in local server memory. To scale across multiple server nodes:
- We recommend replacing the local array registry with a Redis Pub/Sub model.
- Each server node subscribes to a Redis channel. Presence and chat messages are broadcasted via Redis to all nodes, keeping multiple container instances fully synchronized.
