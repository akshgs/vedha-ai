# Vedha AI — AI-Powered Career Intelligence Ecosystem

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Python](https://img.shields.io/badge/Python-3.12.10-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

> **Vedha AI** is an enterprise-grade AI/ML Career Intelligence Ecosystem that intelligently connects **Students**, **Employees**, **Mentors**, **Recruiters**, **Companies**, **Universities**, and **Administrators** into one unified platform.

---

## 🌟 Platform Vision & User Journeys

Vedha AI goes far beyond point solutions (like simple resume builders or job boards) by powering the full career lifecycle from education to enterprise recruitment:

### 1. Student Journey (B2C Lifecycle)
```text
Registration & Auth
    ↓
Profile Setup & Skill DNA Extraction
    ↓
AI Skill Gap Analysis
    ↓
Personalized Learning Roadmap
    ↓
Courses & Video Learning Academy
    ↓
AI Coding & Mock Interview Practice
    ↓
Skill Verification & ATS Resume Optimization
    ↓
AI Job Matching & Applications
    ↓
Mentorship & Networking
    ↓
Continuous Career Intelligence
```

### 2. Company & Recruiter Journey (B2B Lifecycle)
```text
Company Registration & Verification
    ↓
Post Job Listings & Internships
    ↓
Applicant Ingestion & ATS Management
    ↓
AI Candidate Resume Ranking & Match Scoring
    ↓
Interview Slot Scheduling
    ↓
Hiring Pipeline & Offer Letter Issuance
```

---

## 🏗️ Repository Architecture

```text
vedha-ai/
├── backend/                      # Python 3.12 FastAPI Application
│   ├── app/                      # Controllers, Services, Repositories, Models
│   │   ├── api/v1/               # FastAPI REST Routers
│   │   ├── services/             # Business Domain Services
│   │   ├── repositories/         # Data Access Repositories
│   │   ├── models/               # SQLAlchemy 2.0 ORM Declaratives
│   │   ├── ai/                   # Groq LLM & RAG Engine
│   │   └── nlp/                  # spaCy & Keyword Skill Extractors
│   ├── alembic/                  # Database Schema Migrations
│   ├── tests/                    # Pytest Test Suite (42 Automated Tests)
│   ├── main.py                   # FastAPI Application Lifespan & Entrypoint
│   ├── seed.py                   # Standalone Database Seeder CLI
│   ├── requirements.txt          # Python Dependencies (Python 3.12 pinned)
│   ├── runtime.txt               # Python Version Specification (3.12.10)
│   └── Dockerfile                # Multi-stage Container Build
├── frontend/                     # React 18 + Vite + TypeScript Application
│   ├── src/                      # Pages, Components, Layouts, Context
│   ├── public/                   # Static Assets
│   ├── package.json              # Node Dependencies
│   └── vite.config.ts            # Vite Bundler Config
├── deployment/                   # Nginx & Production Infrastructure
│   ├── nginx.conf                # Reverse Proxy Specification
│   └── docker-compose.prod.yml   # Production Compose Stack
├── docs/                         # Architecture Specs & API Documentation
├── render.yaml                   # Render Blueprint Configuration (rootDir: backend)
├── runtime.txt                   # Root Python Runtime Specification
├── .env.example                  # Environment Variables Template
└── README.md                     # Project Documentation
```

---

## ⚡ Tech Stack

### Backend Infrastructure
- **Framework**: FastAPI (Python 3.12)
- **Database**: SQLAlchemy 2.0 (PostgreSQL / SQLite dual compatibility)
- **Migrations**: Alembic
- **AI Models**: Groq API (`llama-3.3-70b-versatile` & `llama-3.1-8b-instant`)
- **NLP & RAG**: spaCy (`en_core_web_sm`), HuggingFace embeddings (`BAAI/bge-small-en-v1.5`), FAISS Vector Index
- **Security**: JWT (`HS256`), Bcrypt password hashing (`passlib`)

### Frontend Infrastructure
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS Design Tokens (Dark Void Theme, Apple HIG & Linear.app design guidelines)
- **Icons**: Lucide React

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### 1. Local Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database schema initialization
python -c "from app.database.init_db import init_db; init_db()"

# Optional: Seed initial demo data
python seed.py

# Start local dev server
uvicorn main:app --reload --port 8000
```
- API Swagger Docs: `http://localhost:8000/docs`
- Health Check Probe: `http://localhost:8000/api/v1/health/ping`

### 2. Local Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite dev server
npm run dev
```
- Web Application UI: `http://localhost:5173`

---

## 🧪 Testing & Verification

### Backend Pytest Test Suite (42 Automated Tests)
```bash
cd backend
python -m pytest
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## ☁️ Deployment Specifications

### Render Blueprint Deployment
The repository includes a production-ready `render.yaml` specification targeting **Python 3.12.10**:
- **Root Directory**: `backend`
- **Build Command**: `pip install -U pip setuptools wheel && pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1`
- **Health Check Path**: `/api/v1/health/ping`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
