# Docker & Compose Configurations Validation - Phase 11

This manual reviews the container configurations, multi-service compose parameters, health probes, and network configurations.

---

## 1. Multi-Stage Dockerfile Validation

The backend uses a multi-stage `Dockerfile` to produce a secure, minimal runtime image:
- **Build Stage (`builder`):** Installs compiler dependencies (`build-essential`, `libpq-dev`) and downloads NLP models (`en_core_web_sm`).
- **Runtime Stage (`runtime`):** Copies site-packages from the builder stage, avoiding extra build dependencies.
- **Non-Root User:** Runs under user `vedha` (`useradd --create-home ...`), minimizing host access risks.
- **Health Check Probe:** Configured to query the health endpoint:
  ```bash
  HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
      CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health/ping')"
  ```

---

## 2. Docker Compose Orchestration

The `docker-compose.yml` configures 4 services:

```
[frontend (Vite: 5173)] ──► [backend (FastAPI: 8000)]
                              ├──► [postgres (PostgreSQL: 5432)]
                              └──► [redis (Redis: 6379)]
```

- **PostgreSQL (`vedha_postgres`):** Runs on alpine, mounts `postgres_data` volume, exposes 5432.
- **Redis (`vedha_redis`):** Runs on alpine, mounts `redis_data` volume, exposes 6379.
- **Backend API (`vedha_backend`):** Depends on postgres and redis being healthy. Exposes 8000.
- **Frontend Client (`vedha_frontend`):** Built from source, exposes 5173 on port 80.

---

## 3. Volume and Network Mappings

- **Data Volumes:**
  - `postgres_data` -> persists PostgreSQL state.
  - `redis_data` -> persists Redis cache indexes.
  - `./app/knowledge` -> mounted read-only (`ro`) to allow dynamic knowledge document updates.
- **Port Mapping Security:**
  - In staging/production, database ports (`5432`) and cache ports (`6379`) should only be accessible within the docker network, not exposed directly to public ports.
