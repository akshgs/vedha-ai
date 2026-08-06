# Deployment & Operations Guide - Phase 12

This guide outlines deployment procedures, server orchestration settings, database migration procedures, and production monitoring.

---

## 1. Local and Staging Deployment

To test uvicorn and database setups on local servers:
1. Copy `.env.example` to `.env` and set local variables.
2. Build and launch containers:
   ```bash
   docker compose up --build
   ```

---

## 2. Production Deployment Execution

For production servers, launch the stack using the production compose file:
```bash
docker compose -f docker-compose.prod.yml up -d
```
This isolates the Postgres database and Redis cache from the host network, exposing only the Nginx proxy gateway ports (80/443).

---

## 3. Database Migration Runbooks

Apply Alembic migrations to synchronize the database schema:
```bash
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

---

## 4. Monitoring & Diagnostics Probes

Load balancers verify liveness and readiness using unauthenticated HTTP endpoints:
- **Ping Probe:** `GET /api/v1/health/ping` (returns `{"pong": true}` with HTTP 200).
- **Subsystem Diagnostic Probe:** `GET /api/v1/health/` (verifies PostgreSQL database connection, Redis connectivity, and vector store indices).
