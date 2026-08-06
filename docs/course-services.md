# Course Services Integration Map

This document maps all API endpoints, methods, parameters, and interfaces for the Course and syllabus services layer.

---

## 1. Catalog & Details Endpoints

### Get Course Catalog
- **Endpoint:** `/courses`
- **Method:** `GET`
- **Response Type:** `Course[]`

### Get Course Details
- **Endpoint:** `/courses/:id`
- **Method:** `GET`
- **Response Type:** `CourseDetailResponse`

---

## 2. Lecture Video Progress

### Update Lesson Progress
- **Endpoint:** `/courses/:courseId/lessons/:lessonId`
- **Method:** `POST`
- **Request Body:** `{ completed: boolean }`
- **Response:** `void`

---

## 3. Discussions Thread Q&A

### Get Discussions
- **Endpoint:** `/courses/:courseId/discussion`
- **Method:** `GET`
- **Response Type:** `DiscussionThread[]`

### Post Comment
- **Endpoint:** `/courses/:courseId/discussion`
- **Method:** `POST`
- **Request Body:** `{ text: string }`
- **Response Type:** `DiscussionThread`
