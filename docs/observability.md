# Observability & Monitoring Guide - Phase 11

This guide outlines logging formats, health monitoring endpoints, metric instrumentation, and OpenTelemetry readiness.

---

## 1. Structured Logging & Auditing

- **Structured JSON Logging:** FastAPI logging drivers can format log outputs to JSON structures:
  ```json
  {"timestamp": "2026-07-28T10:00:00Z", "level": "INFO", "message": "Main loaded successfully", "module": "main"}
  ```
- **Error Capturing:** Exceptions are logged with traceback details to standard error streams (`sys.stderr`), facilitating automatic parsing by container log aggregators.
- **AI Audit Trail:** Details of AI runs are logged asynchronously in the database `ai_interactions` table.

---

## 2. Health Monitoring Probes

FastAPI mounts monitoring routes at `/api/v1/health`:
- **Unauthenticated Ping Endpoint:** `/api/v1/health/ping`
  - Returns `{"pong": true}` with HTTP 200 immediately.
- **System Diagnosis Probe:** `/api/v1/health/`
  - Performs dynamic checks against dependent services:
    1. Database connection check.
    2. Redis cache lookup check.
    3. Vector store indexing check.

---

## 3. Metrics and OpenTelemetry Integration

- **Prometheus Metrics:** Standard Python metrics libraries (e.g. `prometheus-client`) can expose an `/api/v1/metrics` endpoint tracking request duration histogram metrics and exception counts.
- **OpenTelemetry (OTel):** The codebase is structured to integrate OpenTelemetry middleware. Standard tracing hooks can export HTTP request trace spans to Collector backends (Jaeger, Datadog), enabling cross-service trace correlation.
