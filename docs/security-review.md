# Security Review & Audit - Phase 10

This document reviews the cryptographic controls, data verification, and security boundaries implemented in the Vedha AI backend.

---

## 1. Authentication & Session Security

### Cryptographic Hashing
- **Algorithm:** Bcrypt (Blowfish-based key derivation function).
- **Implementation:** Handled via `passlib[bcrypt]` in `app/security/password.py`. Salts are generated automatically per password, mitigating dictionary and rainbow table lookups.

### Token Authentication (JWT)
- **Signature Algorithm:** HMAC-SHA256 (`HS256`).
- **Expiration Policy:** Access tokens default to 60 minutes (`ACCESS_TOKEN_EXPIRE_MINUTES`). Expiration dates are written inside the `exp` claim, preventing replay attacks.
- **Verification:** Secure signature keys (`SECRET_KEY`) sign tokens. Standard FastAPI dependency injections (`get_current_user`) verify the signature before granting handler access.

---

## 2. Mitigation of Common Vulnerabilities (OWASP Top 10)

### SQL Injection Protection
- **ORM Parametrization:** SQLAlchemy 2.x ORM models parse attributes statically and translate queries into parameterized syntax. Parameters are separated from execution plans, neutralizing injection pathways.
- **Raw Queries:** Rare raw query segments (e.g. metadata queries) use bound parameters (`db.execute(text("SELECT ... WHERE id = :id"), {"id": val})`), which are safe.

### Cross-Site Scripting (XSS) Prevention
- **Schema Validation:** Strict Pydantic models validate input strings against structural requirements, discarding unmapped attributes.
- **Rich Text Controls:** Textarea descriptions (e.g., descriptions or resume notes) utilize input cleaners which prevent saving executable script vectors.

### CSRF Protection
- **Token Checks:** API operations rely on explicitly attached `Authorization: Bearer <JWT>` HTTP headers instead of browser cookie stores. Since HTTP requests do not automatically send bearer tokens, cross-site forgery attempts fail.

---

## 3. Operations Guardrails

### CORS Policy Configurations
CORS is explicitly restricted via FastAPI's `CORSMiddleware` using settings parameters:
- **Allowed Origins:** Restricts origin access to verified domains (e.g. `http://localhost:5173`, `http://localhost:3000`). Wildcards are disabled in production mode.
- **Allowed HTTP Methods:** Restricted to `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.

### Rate Limiting Design
- **Local Cache Limits:** Local APIs can enforce request limit profiles (e.g., maximum 30 calls per minute on AI endpoints) using custom rate-limit controllers.
- **Redis Integration:** Production limits are managed using a sliding window algorithm stored in Redis, protecting endpoints against Denial of Service (DoS) attempts.

### Auditing & Logging
- **AI Interactions Logger:** AI endpoints route logging data asynchronously (via `BackgroundTasks`) to the `AIHistoryRepository` table (`ai_interactions`).
- **Logged Variables:** Tracks user IDs, feature keys (e.g. `resume_analyzer`), durations (ms), and statuses (e.g. `success`), providing clear visibility of resource utilization.
