# Docker Configuration & Containerization Guide - Phase 12

This guide reviews the multi-stage build layers, compose configurations, and networking rules for container deployments.

---

## 1. Multi-Stage Builds Optimization

The backend `Dockerfile` leverages multi-stage builds to optimize image sizes and security:
- **Stage 1 (Builder):** Uses a heavy build environment (`python:3.11-slim` with `build-essential` and `libpq-dev`) to download and compile python wheels, packages, and spaCy models (`en_core_web_sm`).
- **Stage 2 (Runtime):** Utilizes a clean, minimal runtime stage. Copies only compiled site-packages from the builder stage, omitting compilers and build files. This reduces the runtime image size.

---

## 2. Docker Compose Configurations

- **`docker-compose.yml` (Development):** Mounts local application folders to support hot-reloading during development.
- **`docker-compose.prod.yml` (Production):** Optimized for production environments:
  - Disables directory mounts for the backend code (uses code copied during image build).
  - Restricts access to PostgreSQL (`5432`) and Redis (`6379`) to the isolated internal network bridge; database ports are not exposed to the host machine.
  - Sets restart policy to `always` to automatically restart containers on host reboot or crash.

---

## 3. Persistent Storage Mappings
- **`postgres_data_prod`:** Keeps Postgres database data persistent across container recreation.
- **`redis_data_prod`:** Persists Redis database cache indexes.
- **`./app/knowledge`:** Mounted read-only (`ro`) to allow updating RAG documents without rebuilding the backend container.
