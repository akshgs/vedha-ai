# Backend API Reference - Phase 9

This document details the route endpoints, request/response formats, and role access schemas.

---

## 1. Coding Platform (LeetCode Sandbox)

### Get Problem Catalog
- **Endpoint:** `/api/v1/coding/problems`
- **Method:** `GET`
- **Response:** `CodingProblem[]`
- **Fields:** `id`, `title`, `difficulty`, `category`, `solved`, `acceptance_rate`, `total_submissions`, `is_premium`, `desc`.

### Get Problem Details
- **Endpoint:** `/api/v1/coding/problems/{problem_id}`
- **Method:** `GET`
- **Response:** `CodingProblemDetail`
- **Fields:** `id`, `title`, `difficulty`, `category`, `solved`, `desc`, `starterCode`, `testCases`, `expected`.

### Run Sandbox Test Cases
- **Endpoint:** `/api/v1/coding/problems/{problem_id}/run`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "code": "string",
    "language": "python | javascript | cpp"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success | error",
    "output": "string"
  }
  ```

### Submit Solution
- **Endpoint:** `/api/v1/coding/problems/{problem_id}/submit`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "code": "string",
    "language": "python | javascript | cpp"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success | error",
    "output": "string",
    "runtime": "string",
    "memory": "string"
  }
  ```

### Get Submission History
- **Endpoint:** `/api/v1/coding/submissions`
- **Method:** `GET`
- **Query Params:** `problemId` (optional)
- **Response:** `Submission[]`

---

## 2. Learning Platform (Courses)

### Get Course Catalog
- **Endpoint:** `/api/v1/courses`
- **Method:** `GET`
- **Response:** `Course[]`

### Get Course Details
- **Endpoint:** `/api/v1/courses/{course_id}`
- **Method:** `GET`
- **Response:** `CourseDetailResponse`

### Update Lesson Progress
- **Endpoint:** `/api/v1/courses/{course_id}/lessons/{lesson_id}`
- **Method:** `POST`
- **Request Body:** `{"completed": boolean}`

---

## 3. Human Recruitment Platform

### Get Sent Applications
- **Endpoint:** `/api/v1/recruitment/applications`
- **Method:** `GET`
- **Response:** `JobApplication[]`

### Book Interview Slot
- **Endpoint:** `/api/v1/recruitment/interviews/book`
- **Method:** `POST`
- **Request Body:** `{"slotId": number, "details": "string"}`
- **Response:** `ScheduledInterview`
