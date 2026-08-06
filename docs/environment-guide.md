# Environment Configurations Guide - Phase 12

This guide outlines environment variables settings, secrets, and connection parameters.

---

## 1. Secrets Security Guidelines

To maintain database security:
- **No Hardcoded Credentials:** All credentials (database passwords, Redis auth, API keys) must be loaded dynamically from the host environment, never checked into repository version controls.
- **Production Secret Key:** Generate a unique 32-character hex key to sign JWT tokens using:
  ```bash
  openssl rand -hex 32
  ```

---

## 2. Configuration Parameters

- **`ENVIRONMENT`:** Set to `production` (disables debug pages and verbose error stack traces).
- **`SECRET_KEY`:** Cryptographic key for signing JWT tokens.
- **`ALLOWED_ORIGINS`:** JSON array listing authorized origin URLs (e.g. `["https://app.vedha.ai"]`).
- **`DATABASE_URL`:** PostgreSQL database connection string.
- **`REDIS_PASSWORD` & `REDIS_URL`:** Connection configurations for the caching server.
- **`GROQ_API_KEY`:** API key for Groq LLM inference services.
- **`SMTP_HOST` / `SMTP_PORT` / `SMTP_PASSWORD`:** Credentials for system email delivery.
