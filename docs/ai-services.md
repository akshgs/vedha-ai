# AI Services API Contract

This document catalogs the request/response payloads, endpoints, and method bindings for the 15 unified AI features.

---

## 1. Advisor & Mentoring Operations

### AI Career Mentor
- **Endpoint:** `/ai/mentor`
- **Method:** `POST`
- **Request:** `{ message: string, history: ChatMessage[] }`
- **Response:** `CareerMentorResponse`

### AI Career & Salary Predictor
- **Endpoint:** `/ai/career/predict`
- **Method:** `GET`
- **Response:** `CareerPredictionResponse`

---

## 2. Resume & Performance Appraisals

### AI Resume Analyzer & Builder
- **Endpoint:** `/ai/resume/analyze`
- **Method:** `POST`
- **Request:** `{ resumeFileContent: string, targetRole: string }`
- **Response:** `ResumeAnalysisResponse`

### AI Skill Gap Calculator
- **Endpoint:** `/ai/skills/gap`
- **Method:** `POST`
- **Request:** `{ currentSkills: string[], targetRole: string }`
- **Response:** `SkillGapResponse`

---

## 3. Monaco Sandbox Code Assistant

### AI Coding Assistant
- **Endpoint:** `/ai/coding/assistant`
- **Method:** `POST`
- **Request:** `{ code: string, problemId: number, language: string, errorLog?: string }`
- **Response:** `CodingHelpResponse`

---

## 4. Academic Document Extraction

### AI PDF Document Chat
- **Endpoint:** `/ai/pdf-chat`
- **Method:** `POST`
- **Request:** `{ fileId: string, question: string }`
- **Response:** `PdfChatResponse`

### AI Research Assistant
- **Endpoint:** `/ai/research/query`
- **Method:** `POST`
- **Request:** `{ query: string }`
- **Response:** `ResearchAssistantResponse`
