# Enterprise Security Audit - Phase 11

This audit reviews cryptographic configurations, endpoint authorization checks, data input validations, and operational compliance.

---

## 1. Cryptography & Authentication

- **Password Hashing:** Handled via Bcrypt inside `app/security/password.py`. A unique random salt is generated per password string.
- **JWT Session Configuration:** Signed using HMAC-SHA256 (`HS256`). Expiration timestamps are coded inside the `exp` claim (default 60 minutes). Signature keys are loaded exclusively from the environment (`SECRET_KEY`).
- **Authentication Failure Logging:** Failed logins raise an HTTP 401 Unauthorized exception, which is captured by system logging drivers to flag potential brute-force vectors.

---

## 2. Authorization & RBAC

- **Endpoint Authorization:** Handled via FastAPI dependency injection:
  ```python
  current_user: User = Depends(get_current_user)
  ```
- **Role-Based Access Control (RBAC):** Restricts data access based on role attributes:
  - Admin paths (`/api/v1/admin`) verify `user.role == "admin"`.
  - Recruitment matches (`/api/v1/recruitment`) verify `user.role == "student"` or `"recruiter"`.
  - User profile endpoints check that the requesting user's ID matches the target resource ID, preventing IDOR (Indirect Object Reference) leaks.

---

## 3. Mitigations for OWASP Top 10

### SQL Injection Protection
- **ORM Parameterization:** SQLAlchemy 2.0 ORM translates all Python attributes into parameterized arguments, preventing injection payloads.
- **Raw Queries:** Handled via database session parameters execution:
  ```python
  db.execute(text("SELECT ... WHERE id = :id"), {"id": val})
  ```

### XSS & CSRF Protections
- **XSS Prevention:** Input data is typed and validated by Pydantic models. String parameters are cleaned, neutralizing script tags.
- **CSRF Mitigations:** Stateless JWT tokens are attached via custom HTTP `Authorization: Bearer <token>` headers instead of auto-sent browser cookie buffers.

---

## 4. Operational Guardrails

- **File Upload Validation:** Resume upload parameters verify:
  1. Content-Type: Limited to `application/pdf`.
  2. File Size: Enforces a maximum payload limit (e.g. 5MB), raising HTTP 400 on violations.
- **CORS Policies:** Configured in `main.py` via `CORSMiddleware`. Restricts resource sharing to authorized origins (e.g. `https://app.vedha.ai`). Wildcards are disabled.
- **Rate Limiting:** Implemented on AI endpoints using a sliding window algorithm in Redis, guarding against API denial-of-service attempts.
- **Security Headers:** Recommended headers (e.g., `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Content-Security-Policy`) are configured in reverse proxy gateways (e.g. Nginx or Cloudflare) to optimize performance.
