# Student Services Layer Specifications

This document catalogs the data services, Axios central client rules, and model parameters for the Student Module API integration.

## Centralized Axios Interceptors

All requests channel through the `api` client inside `src/services/api.ts`:
- **Auth Token:** Injects `"Authorization: Bearer <token>"` headers dynamically.
- **Failures Handling:** Intercepts `401 Unauthorized` sessions to clean storage and route back to login, displaying toast notifications.

## Service Schemas

### 1. Dashboard Service (`src/services/dashboard.ts`)
- **Endpoints:**
  - `GET /dashboard`: Returns parsed metrics, streak counts, upcoming session calendars.

### 2. Resume Service (`src/services/resume.ts`)
- **Endpoints:**
  - `POST /resume/upload`: Form-data payload returning structured ATS scores, missing keywords, and detailed suggestions.

### 3. Skills Service (`src/services/skillService.ts`)
- **Endpoints:**
  - `GET /skills`: Query skill proficiency lists.
  - `POST /skills`: Create skill nodes.
  - `DELETE /skills/:id`: Delete skill entries.

### 4. Coding Sandbox Service (`src/services/coding.ts`)
- **Endpoints:**
  - `GET /coding/problems`: Lists algorithmic tasks.
  - `POST /coding/problems/:id/run`: Executes compiler tests.
  - `POST /coding/problems/:id/submit`: Submits solutions and returns runtime metrics.
  - `GET /coding/submissions`: Retrieves solution histories logs.
  - `GET /coding/stats`: Fetches streaks.
  - `GET /coding/leaderboard`: Pulls weekly XP leaders.

### 5. Career Service (`src/services/career.ts`)
- **Endpoints:**
  - `POST /career/mentor`: Consumes history log to return AI advisory messages.
  - `GET /career/tracks`: Fits predictions metrics.
  - `GET /career/salaries`: Returns region-specific curves (India, US, EU, UK).
  - `POST /career/job-match`: Compiles compatibility scores.
