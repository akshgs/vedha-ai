# Nginx Proxy Routing and Security Guide - Phase 12

This guide outlines reverse proxy configurations, compression parameters, and static caching settings.

---

## 1. Routing Proxy Paths

Nginx maps incoming requests across the frontend client and backend API upstream targets:
- **FastAPI API Routing:** Proxy passes `/api/v1` traffic to the backend server.
- **WebSocket Upgrade Routing:** Proxy passes `/ws/v1` paths, attaching upgrade headers to keep connections open:
  ```nginx
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
  ```
- **Static Frontend Routing:** Serves compiled frontend assets (HTML, CSS, JS) from port 80.

---

## 2. Gzip & Static Asset Caching

- **Gzip Compression:** Compression is active for json, css, javascript, and html types, reducing payload sizes and latency over slow networks.
- **Asset Caching:** Static assets (images, icons, scripts) include `Cache-Control` header directives configured for 1 month (`expires 1M`), reducing repeated server hits.

---

## 3. Rate Limiting and Security Headers

- **Rate Limiting Zones:**
  - Standard API routes: Limited to 10 requests per second (`rate=10r/s`).
  - AI Inference endpoints: Limited to 2 requests per second (`rate=2r/s`) to prevent CPU exhaustion.
- **Security Headers:** Adds HSTS, nosniff, frame options block, and CSP policies on all response streams, defending against XSS and clickjacking.
