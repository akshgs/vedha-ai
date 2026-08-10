# 🚀 Vedha AI — AI-Powered Career Intelligence Ecosystem

> **Vedha AI** is an enterprise-grade AI/ML Career Intelligence Ecosystem that connects **Students, Employees, Mentors, Recruiters, Companies, Universities, and Administrators** through intelligent learning, skill intelligence, recruitment, mentorship, and career-development workflows.

Vedha AI goes beyond traditional job boards, resume builders, and learning platforms by combining **Generative AI, NLP, Retrieval-Augmented Generation (RAG), semantic search, vector retrieval, skill intelligence, recommendation systems, AI-powered interviews, candidate matching, and career analytics** into a unified platform.

---

## 🌟 Platform Vision

The modern career journey is fragmented across multiple platforms:

```text
Learning          → Learning Platforms
Coding Practice   → Coding Platforms
Resume            → Resume Builders
Jobs              → Job Boards
Interviews        → Interview Platforms
Mentorship        → Mentorship Communities
Recruitment       → ATS Platforms
```

Vedha AI brings these workflows together into one intelligent ecosystem.

```text
                         ┌──────────────────────────┐
                         │        VEDHA AI          │
                         │ Career Intelligence      │
                         │        Ecosystem         │
                         └────────────┬─────────────┘
                                      │
        ┌───────────────┬─────────────┼──────────────┬───────────────┐
        │               │             │              │               │
        ▼               ▼             ▼              ▼               ▼
    Learning         Skills        Jobs        Mentorship      Recruitment
        │               │             │              │               │
        └───────────────┴─────────────┼──────────────┴───────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │ Personalized Career     │
                         │ Intelligence Engine     │
                         └─────────────────────────┘
```

---

# 🎯 End-to-End User Journeys

## 1. Student & Employee Journey — B2C

```text
Registration & Authentication
              ↓
Profile Creation
              ↓
Skill DNA Extraction
              ↓
AI Skill Gap Analysis
              ↓
Personalized Learning Roadmap
              ↓
Courses & Video Learning
              ↓
AI Coding Practice
              ↓
AI Mock Interviews
              ↓
Skill Verification
              ↓
ATS Resume Optimization
              ↓
AI Job Matching
              ↓
Job Applications
              ↓
Mentorship & Networking
              ↓
Continuous Career Intelligence
```

## 2. Company & Recruiter Journey — B2B

```text
Company Registration
        ↓
Company Verification
        ↓
Job & Internship Creation
        ↓
Applicant Ingestion
        ↓
ATS Management
        ↓
AI Resume Analysis
        ↓
Candidate Match Scoring
        ↓
Candidate Ranking
        ↓
Interview Scheduling
        ↓
Hiring Pipeline
        ↓
Offer Letter Issuance
```

---

# 🧠 AI/ML Architecture

The core of Vedha AI is a modular AI architecture designed to separate **LLM inference, retrieval, embeddings, NLP processing, business intelligence, and application services**.

```text
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│              TypeScript + Vite + CSS                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                          │
│                REST APIs + WebSockets                        │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌────────────────┐    ┌───────────────┐
│ Auth & RBAC   │    │ Domain Services│    │ Real-Time     │
│ JWT / Bcrypt  │    │ Business Logic │    │ WebSockets    │
└───────────────┘    └───────┬────────┘    └───────────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │          AI Layer            │
              ├─────────────────────────────┤
              │ LLM Orchestration           │
              │ Prompt Engineering           │
              │ RAG Pipeline                 │
              │ Embedding Generation         │
              │ Vector Retrieval             │
              │ Semantic Search              │
              │ NLP Skill Extraction         │
              │ Skill Intelligence           │
              │ Recommendation Engine        │
              │ Job Matching                 │
              │ Interview Intelligence       │
              └──────────────┬──────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
      ┌────────────────┐           ┌─────────────────┐
      │ FAISS Vector   │           │ PostgreSQL      │
      │ Index          │           │ Relational Data │
      └────────────────┘           └─────────────────┘
```

---

# 🤖 Generative AI Architecture

Vedha AI uses a provider-based LLM architecture to avoid tightly coupling the application to a single model.

### Current LLM Infrastructure

* **Groq API**
* **Llama 3.3 70B**
* **Llama 3.1 8B**
* LangChain
* LangChain Core
* LangChain Community

The architecture supports different models for different workloads.

```text
User Request
     ↓
Request Classification
     ↓
AI Service
     ↓
Prompt / Context Construction
     ↓
Model Selection
     ↓
LLM Inference
     ↓
Response Processing
     ↓
Structured Application Response
```

This separation makes the AI layer easier to maintain, evaluate, and extend.

---

# 🔎 Retrieval-Augmented Generation — RAG

Vedha AI implements a RAG pipeline to ground AI responses in relevant application and knowledge-base context.

```text
                User Query
                    ↓
             Query Processing
                    ↓
              Text Embedding
                    ↓
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
    Vector Retrieval     Semantic Search
          │                   │
          └─────────┬─────────┘
                    ↓
             Context Ranking
                    ↓
             Context Filtering
                    ↓
             Prompt Assembly
                    ↓
                  LLM
                    ↓
           Grounded Response
                    ↓
          Response Validation
```

### RAG Stack

* HuggingFace
* `BAAI/bge-small-en-v1.5`
* Sentence Transformers
* FAISS
* LangChain
* Document processing
* Semantic retrieval
* Context-aware generation

---

# 🧩 Embedding & Vector Search Pipeline

Unstructured information is transformed into searchable vector representations.

```text
Documents
   ↓
Text Extraction
   ↓
Cleaning & Normalization
   ↓
Chunking
   ↓
Embedding Generation
   ↓
Vector Representation
   ↓
FAISS Index
   ↓
Similarity Search
   ↓
Top-K Relevant Context
```

This enables semantic retrieval rather than relying only on exact keyword matches.

---

# 📝 NLP & Skill Intelligence

Vedha AI processes resumes, job descriptions, profiles, and career information using NLP pipelines.

```text
Resume / Job Description
            ↓
       Text Extraction
            ↓
       Preprocessing
            ↓
       NLP Processing
            ↓
      Entity Extraction
            ↓
       Skill Extraction
            ↓
    Skill Normalization
            ↓
      Skill Taxonomy
            ↓
      Structured Profile
```

### NLP Technologies

* spaCy
* `en_core_web_sm`
* Transformer embeddings
* Keyword extraction
* Semantic similarity
* Skill normalization

---

# 🧬 Skill DNA

Vedha AI converts unstructured career information into a structured representation of a user's capabilities.

```text
Resume
+
Projects
+
Experience
+
Learning Activity
+
Assessments
+
Target Role
        ↓
   Skill Extraction
        ↓
 Skill Normalization
        ↓
 Skill Classification
        ↓
      Skill DNA
```

Skill DNA is then used by downstream intelligence systems for:

* Skill-gap analysis
* Career recommendations
* Learning recommendations
* Job matching
* Candidate ranking
* Interview preparation

---

# 📊 AI Skill-Gap Analysis

The platform compares a user's current skill profile against target roles and job requirements.

```text
Current Skill Profile
          +
Target Role Requirements
          ↓
    Skill Comparison
          ↓
     Gap Detection
          ↓
   Priority Calculation
          ↓
Recommended Skills
          ↓
Learning Roadmap
```

The resulting intelligence can identify:

* Existing skills
* Missing skills
* Partially matched skills
* High-priority skills
* Recommended learning areas

---

# 🎓 Personalized Learning Intelligence

Vedha AI transforms skill gaps into personalized learning recommendations.

```text
User Skill DNA
      ↓
Skill Gap Analysis
      ↓
Target Career Role
      ↓
Learning Objective
      ↓
Course / Resource Matching
      ↓
Personalized Roadmap
      ↓
Progress Tracking
      ↓
Continuous Recommendation
```

This creates a feedback loop between learning activity and career intelligence.

---

# 💼 AI Job Matching

Vedha AI uses skill-aware matching rather than simple keyword-based filtering.

```text
                    Candidate
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      Skills       Experience      Projects
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                Matching Engine
                       │
                       ▼
                Job Requirements
                       │
                       ▼
                Similarity Analysis
                       │
                       ▼
                  Match Score
                       │
                       ▼
                Candidate Ranking
```

Matching signals include:

* Required skills
* Relevant experience
* Projects
* Education
* Semantic similarity
* Role alignment

---

# 👥 AI Candidate Ranking

For recruiters, Vedha AI transforms applicant information into structured candidate intelligence.

```text
Applicants
    ↓
Resume Parsing
    ↓
NLP Processing
    ↓
Skill Extraction
    ↓
Requirement Matching
    ↓
Semantic Similarity
    ↓
Candidate Scoring
    ↓
Ranking
    ↓
Recruiter Dashboard
```

This reduces the dependence on manual resume screening and enables skill-based candidate discovery.

---

# 🎤 AI Interview Intelligence

Vedha AI supports AI-driven technical and career interview workflows.

```text
Target Role
    ↓
Candidate Skill Profile
    ↓
Interview Context
    ↓
Question Generation
    ↓
Candidate Response
    ↓
AI Evaluation
    ↓
Performance Analysis
    ↓
Feedback
    ↓
Improvement Recommendations
```

Interview intelligence can be used for:

* Technical interviews
* Role-specific questions
* Mock interviews
* Skill evaluation
* Feedback generation
* Preparation recommendations

---

# 🤝 AI Agent Architecture

Complex career workflows are structured into specialized AI capabilities.

```text
                    AI Orchestration
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
    Career Agent      Learning Agent    Interview Agent
          │                │                 │
          ▼                ▼                 ▼
    Skill Analysis    Roadmap         Question Generation
    Career Advice     Recommendations  Evaluation
    Role Matching     Progress         Feedback

                           │
                           ▼
                  Recruitment Agent
                           │
                  Candidate Analysis
                  Skill Matching
                  Ranking
```

The modular approach allows individual AI workflows to evolve independently without coupling the entire platform to one monolithic AI service.

---

# 🔄 Continuous Career Intelligence

Vedha AI is designed around a continuous intelligence loop.

```text
              ┌──────────────────────┐
              │    User Activity     │
              └──────────┬───────────┘
                         ↓
                  Data Collection
                         ↓
                  Skill Analysis
                         ↓
                Career Intelligence
                         ↓
                 Recommendation
                         ↓
                  User Action
                         ↓
              ─────── Feedback ───────
                         │
                         └──────────────►
```

As users learn, practice, build projects, complete interviews, and interact with the platform, their career profile can continuously evolve.

---

# 🏗️ Repository Architecture

```text
vedha-ai/
│
├── backend/                              # FastAPI Application
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/                       # Versioned REST APIs
│   │   ├── services/                     # Business Domain Services
│   │   ├── repositories/                 # Data Access Layer
│   │   ├── models/                       # SQLAlchemy ORM Models
│   │   ├── ai/                           # LLM & RAG Engine
│   │   └── nlp/                          # NLP & Skill Extraction
│   │
│   ├── alembic/                          # Database Migrations
│   ├── tests/                            # Pytest Test Suite
│   ├── main.py                           # FastAPI Entrypoint
│   ├── seed.py                           # Database Seeder
│   ├── requirements.txt                  # Python Dependencies
│   ├── runtime.txt                       # Python Runtime
│   └── Dockerfile                        # Container Definition
│
├── frontend/                             # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── context/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── deployment/
│   ├── nginx.conf                         # Reverse Proxy
│   └── docker-compose.prod.yml            # Production Stack
│
├── docs/                                  # Architecture & API Docs
├── render.yaml                            # Render Deployment Blueprint
├── runtime.txt
├── .env.example
└── README.md
```

---

# ⚡ Technology Stack

## Backend

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| Python 3.12      | Backend & AI development       |
| FastAPI          | High-performance API framework |
| SQLAlchemy 2.0   | ORM / data access              |
| PostgreSQL       | Production database            |
| SQLite           | Local compatibility            |
| Alembic          | Database migrations            |
| Pytest           | Automated testing              |
| JWT              | Authentication                 |
| Passlib / Bcrypt | Password security              |

## AI / ML / NLP

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| Groq                  | LLM inference            |
| Llama 3.3 70B         | Advanced AI workflows    |
| Llama 3.1 8B          | Lightweight AI workflows |
| LangChain             | LLM orchestration        |
| LangChain Core        | AI primitives            |
| HuggingFace           | Transformer ecosystem    |
| Sentence Transformers | Embeddings               |
| BAAI/BGE              | Semantic embeddings      |
| FAISS                 | Vector similarity search |
| spaCy                 | NLP processing           |
| scikit-learn          | Machine learning         |
| NumPy                 | Numerical computation    |
| Pandas                | Data processing          |

## Frontend

| Technology   | Purpose               |
| ------------ | --------------------- |
| React 18     | UI framework          |
| TypeScript   | Type-safe development |
| Vite 6       | Build tooling         |
| Vanilla CSS  | Design system         |
| Lucide React | Icon system           |

## Infrastructure

| Technology | Purpose          |
| ---------- | ---------------- |
| Docker     | Containerization |
| Nginx      | Reverse proxy    |
| Render     | Cloud deployment |
| GitHub     | Source control   |

---

# 🔐 Security Architecture

Vedha AI implements multiple application security mechanisms:

* JWT-based authentication
* Role-based access control
* Bcrypt password hashing
* Environment-based secret management
* Request validation
* Protected API routes
* CORS configuration
* Database security
* Secure error handling

Sensitive credentials are intentionally excluded from source control through environment-based configuration.

---

# 🧪 Testing & Verification

The backend includes **42 automated Pytest tests** covering core application functionality.

Run backend tests:

```bash
cd backend
python -m pytest
```

Frontend production build:

```bash
cd frontend
npm run build
```

Production verification focuses on:

* Authentication
* API endpoints
* Database operations
* Business services
* AI workflows
* NLP processing
* RAG functionality
* Error handling

---

# 🚀 Quick Start

## Prerequisites

* Python 3.12+
* Node.js 18+
* Git

---

## Backend Setup

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Initialize the database:

```bash
python -c "from app.database.init_db import init_db; init_db()"
```

Seed demo data:

```bash
python seed.py
```

Start the development server:

```bash
uvicorn main:app --reload --port 8000
```

### Backend

```text
http://localhost:8000
```

### Swagger API Documentation

```text
http://localhost:8000/docs
```

### Health Check

```text
http://localhost:8000/api/v1/health/ping
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# ☁️ Production Deployment

Vedha AI includes a Render deployment blueprint.

### Runtime

```text
Python 3.12.10
```

### Root Directory

```text
backend
```

### Build Command

```bash
pip install -U pip setuptools wheel && pip install -r requirements.txt
```

### Start Command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
```

### Health Check

```text
/api/v1/health/ping
```

Production infrastructure is also available under:

```text
deployment/
```

including:

* Nginx reverse proxy
* Docker Compose production configuration

---

# 📈 Engineering Highlights

Vedha AI demonstrates practical implementation across modern AI and software engineering disciplines.

### AI Engineering

* Large Language Models
* Prompt engineering
* RAG
* Embeddings
* Vector search
* Semantic retrieval
* AI agents
* AI recommendations
* AI interview evaluation

### Machine Learning / NLP

* NLP pipelines
* Skill extraction
* Entity extraction
* Semantic similarity
* Skill normalization
* Candidate matching
* Recommendation workflows

### Backend Engineering

* FastAPI
* REST API design
* Repository pattern
* Service-layer architecture
* SQLAlchemy
* PostgreSQL
* Authentication
* Database migrations
* WebSockets

### Production Engineering

* Docker
* Nginx
* Cloud deployment
* Environment configuration
* Health checks
* Automated testing
* Modular architecture

---

# 🗺️ Roadmap

## Platform

* [x] Authentication
* [x] User profiles
* [x] Student workflows
* [x] Employee workflows
* [x] Mentor workflows
* [x] Recruiter workflows
* [x] Company workflows
* [x] University workflows
* [x] Administrator workflows
* [x] Job & internship workflows
* [x] ATS workflows
* [x] Interview workflows
* [x] Mentorship workflows

## AI Intelligence

* [x] LLM integration
* [x] RAG pipeline
* [x] Embedding generation
* [x] FAISS vector search
* [x] NLP skill extraction
* [x] Skill DNA
* [x] Skill-gap analysis
* [x] Personalized learning recommendations
* [x] AI job matching
* [x] Candidate ranking
* [x] AI interview workflows
* [x] Career intelligence

## Production

* [x] FastAPI production architecture
* [x] PostgreSQL compatibility
* [x] Database migrations
* [x] Authentication & security
* [x] Automated testing
* [x] Docker configuration
* [x] Nginx configuration
* [x] Render deployment configuration
* [x] Health checks

---

# 📊 Architecture Principles

### Modular AI

AI functionality is separated into reusable components rather than embedding LLM calls throughout the application.

### Retrieval Before Generation

Where contextual knowledge is required, relevant information is retrieved before generation.

### Provider Abstraction

LLM integrations are isolated so model providers can be changed without rewriting the business layer.

### Domain Separation

API routes, business services, repositories, AI workflows, and data models are separated to improve maintainability.

### Production-Oriented Design

Security, testing, deployment, database migrations, health checks, and infrastructure are treated as core engineering concerns.

### Continuous Intelligence

Career recommendations are designed to evolve as the user's skills, learning activity, goals, and professional experience change.

---

# 📚 Documentation

Additional architecture and API documentation is available in:

```text
docs/
```

API documentation is automatically available through FastAPI Swagger:

```text
http://localhost:8000/docs
```

---

# 🎓 Project Value

Vedha AI demonstrates the integration of **AI/ML with production software engineering**, covering the complete pipeline from unstructured career data to intelligent application-level decisions.

```text
Unstructured Career Data
          ↓
       NLP / ML
          ↓
     Skill Intelligence
          ↓
      Embeddings
          ↓
     Vector Search
          ↓
        RAG
          ↓
       LLM / AI
          ↓
     AI Reasoning
          ↓
Recommendations / Matching / Evaluation
          ↓
      User Action
```

This makes Vedha AI more than an AI chatbot or a CRUD recruitment application. It is a **full-stack AI system combining NLP, semantic retrieval, Generative AI, recommendation logic, career intelligence, and production backend engineering**.

---

# 👨‍💻 Author

**Aksh**

AI/ML & Data Science Developer

---

# 📄 License

This project is licensed under the **MIT License**.

See [`LICENSE`](LICENSE) for the complete license text.

---

<p align="center">

### 🚀 Vedha AI

**Learn → Build → Validate → Connect → Get Hired → Grow**

</p>
