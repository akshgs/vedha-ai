# API Endpoint Validation Specification - Phase 11

This specification maps the route endpoints, request models, query parameters, pagination rules, and OpenAPI descriptions.

---

## 1. OpenAPI & Swagger Documentation
- **Endpoint:** `/docs` (Swagger UI) & `/redoc` (ReDoc UI).
- **Compliance:** Enforces OpenAPI 3.0 specifications generated automatically by FastAPI based on Pydantic router schemas.

---

## 2. Core API Validation Matrix

| Endpoint Path | Method | Auth/Role | Request Model | Response / Status Codes | Query Parameters (Pagination, Filters, Sort) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | Public | `RegisterRequest` | `200 OK` / `400 Bad Request` | *None* |
| `/api/v1/auth/login` | `POST` | Public | `LoginRequest` | `200 OK` / `401 Unauthorized` | *None* |
| `/api/v1/auth/me` | `GET` | Authenticated | *None* | `200 OK` / `401` | *None* |
| `/api/v1/coding/problems` | `GET` | Authenticated | *None* | `200 OK` | `difficulty`, `tag`, `search`, `page`, `page_size` |
| `/api/v1/coding/problems/{id}` | `GET` | Authenticated | *None* | `200 OK` / `404` | *None* |
| `/api/v1/coding/problems/{id}/run` | `POST` | Authenticated | `{"code": str, "language": str}` | `200 OK` / `400` | *None* |
| `/api/v1/coding/problems/{id}/submit` | `POST` | Authenticated | `{"code": str, "language": str}` | `201 Created` / `400` | *None* |
| `/api/v1/coding/submissions` | `GET` | Authenticated | *None* | `200 OK` | `problemId` (filter) |
| `/api/v1/courses` | `GET` | Authenticated | *None* | `200 OK` | *None* |
| `/api/v1/courses/{id}` | `GET` | Authenticated | *None* | `200 OK` / `404` | *None* |
| `/api/v1/courses/{id}/lessons/{id}`| `POST` | Authenticated | `{"completed": bool}` | `200 OK` / `404` | *None* |
| `/api/v1/courses/{id}/bookmark` | `POST` | Authenticated | *None* | `200 OK` | *None* |
| `/api/v1/recruitment/applications` | `GET` | Authenticated | *None* | `200 OK` | *None* |
| `/api/v1/recruitment/interviews/slots`| `GET` | Authenticated | *None* | `200 OK` | `company` (filter) |
| `/api/v1/recruitment/offers` | `GET` | Authenticated | *None* | `200 OK` | *None* |
| `/api/v1/notifications/{id}/read` | `POST`/`PATCH`| Authenticated | *None* | `200 OK` / `404` | *None* |

---

## 3. Query Execution, Sorting, and Filters

- **Pagination Structure:** Standardizes on `page` (1-indexed offset multiplier) and `page_size` (limit scale).
- **Filtering Parameters:** Query attributes (e.g. `difficulty=easy`, `company=Google`) filter database rows directly in repository layers.
- **Sorting Schemes:** Listings sort by primary lookup fields (e.g. submissions sorted by `created_at DESC` to display the most recent attempts first).
- **Validation Errors Handling:** Pydantic validation failures trigger structured HTTP 422 Unprocessable Entity responses mapping location paths.
