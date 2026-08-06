# System Anomaly & Bug Report - Phase 13 E2E

This report tracks system anomalies, scaling risks, and recommendations identified during validation checks.

---

## 1. WebSocket Local Memory Scaling Limit

- **Severity:** **Medium**
- **Impact:** Scale limitations on multi-node container environments.
- **Description:** Active WebSocket connections and presence states are managed inside local python memory structures (`ConnectionManager`).
- **Steps to Reproduce:**
  1. Launch the platform across two independent container nodes behind a round-robin load balancer.
  2. Candidate A connects to Node 1, Candidate B connects to Node 2.
  3. Candidate A sends a chat message.
- **Expected Result:** Both candidates receive the chat broadcast immediately.
- **Actual Result:** Only Candidate A receives the message because connection states are localized.
- **Suggested Fix:** Refactor `ConnectionManager` inside `app/api/v1/websocket.py` to broadcast events using a Redis Pub/Sub backplane channel.

---

## 2. Local Code Sandbox CPU Spikes

- **Severity:** **Medium**
- **Impact:** Resource exhaustion on high concurrent coding submissions.
- **Description:** Code sandbox compiles and runs user code (e.g. C++ via `g++` and JS via `node`) directly on the host API instance.
- **Steps to Reproduce:**
  1. Trigger 50 concurrent solution submissions on the `/submit` endpoint.
  2. Monitor CPU spikes on the API server.
- **Expected Result:** Core API endpoints (e.g. auth login) continue to respond under 20ms.
- **Actual Result:** Compilation processes consume host CPU resources, causing temporary latency spikes on web routes.
- **Suggested Fix:** Decouple `CompilerService` runs, executing compilation inside isolated worker queues (e.g. Celery workers or AWS Lambda instances).

---

## 3. Database Mocking Depth in Unit Tests

- **Severity:** **Low**
- **Impact:** Code coverage does not evaluate raw database query performance.
- **Description:** Pytest test suites mock out repository queries (`CourseRepository`, `RecruitmentRepository`) to run without active database connection requirements.
- **Steps to Reproduce:**
  1. Run `pytest`.
- **Expected Result:** Database indexes, constraints, and cascading deletes are audited during test suite execution.
- **Actual Result:** Unit tests execute successfully using in-memory mock returns, bypassing database validation.
- **Suggested Fix:** Expand testing pipelines to execute integration tests against a local test database.
