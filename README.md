# CareerLens — Career Management Platform

A production-ready full-stack web application for managing your job search in one place. Upload resumes, analyze ATS compatibility, track applications with a drag-and-drop Kanban board, and visualize your progress with analytics charts.

**No paid AI APIs required — runs entirely free.**

---

## Live Demo

- **Frontend:** https://careerlens.vercel.app
- **API Docs:** https://careerlens-api.onrender.com/docs

---

## Features

- **Authentication** — Register, login, JWT-protected routes, profile management
- **Resume Upload** — Drag-and-drop PDF/DOCX upload with text extraction
- **ATS Analyzer** — Keyword-matching engine scores resume vs job description (no paid API)
- **Application Tracker** — Drag-and-drop Kanban board across 5 status columns
- **Analytics Dashboard** — Charts for status distribution, application trends, top missing skills
- **Fully Deployed** — Vercel + Render + Neon PostgreSQL, all free tier

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, Recharts |
| Backend     | Python, FastAPI, SQLAlchemy         |
| Auth        | JWT (python-jose), Bcrypt           |
| Database    | PostgreSQL (Neon)                   |
| File Parse  | PyPDF2, python-docx                 |
| Drag & Drop | @hello-pangea/dnd                   |
| Deploy      | Vercel (frontend), Render (backend) |

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- A PostgreSQL database (or free Neon account at neon.tech)

### 1. Clone the repo

```bash
git clone https://github.com/HarshaVardhanRepudi/careerlens.git
cd careerlens
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env — set DATABASE_URL and SECRET_KEY
```

**.env**
```
DATABASE_URL=postgresql://user:password@host/careerlens
SECRET_KEY=your-random-secret-key-at-least-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

```bash
uvicorn app.main:app --reload
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 3. Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# Edit .env.local
```

**.env.local**
```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
# App running at http://localhost:5173
```

---

## Deployment

### Step 1 — Neon PostgreSQL (free)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the **connection string** — you'll need it for Render

### Step 2 — Render (backend, free)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `DATABASE_URL` → your Neon connection string
   - `SECRET_KEY` → any long random string
   - `ALGORITHM` → `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` → `1440`
7. Deploy — note your backend URL (e.g. `https://careerlens-api.onrender.com`)

### Step 3 — Vercel (frontend, free)
1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `VITE_API_URL` → your Render backend URL
5. Deploy

---

## API Endpoints

```
POST   /auth/register          Register new user
POST   /auth/login             Login, returns JWT token
GET    /auth/profile           Get current user
PUT    /auth/profile           Update name/email

POST   /resume/upload          Upload PDF or DOCX
GET    /resume/list            List all resumes
GET    /resume/{id}            Get specific resume
DELETE /resume/{id}            Delete resume

POST   /ats/analyze            Analyze resume vs job description
GET    /ats/history            Recent analysis history

GET    /applications           Get all applications
POST   /applications           Create application
PUT    /applications/{id}      Update application
DELETE /applications/{id}      Delete application

GET    /analytics              Full analytics summary
```

---

## Project Structure

```
careerlens/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── database.py              # SQLAlchemy setup
│   │   ├── models/                  # Database models
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   └── application.py
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   │   ├── auth.py
│   │   │   └── application.py
│   │   ├── routers/                 # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── resume.py
│   │   │   ├── ats.py
│   │   │   ├── tracker.py
│   │   │   └── analytics.py
│   │   ├── services/                # Business logic
│   │   │   ├── ats_service.py       # Keyword matching engine
│   │   │   └── resume_service.py    # PDF/DOCX extraction
│   │   └── utils/
│   │       ├── jwt.py
│   │       ├── password.py
│   │       └── dependencies.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useApi.js
│       ├── utils/
│       │   ├── validators.js
│       │   └── formatters.js
│       ├── services/
│       │   └── api.js               # Axios API layer
│       ├── components/
│       │   ├── ui/                  # Reusable UI components
│       │   └── layout/              # Sidebar, Layout, ProtectedRoute
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── ResumeUpload.jsx
│           ├── ATSAnalyzer.jsx
│           ├── Tracker.jsx
│           ├── Analytics.jsx
│           └── Profile.jsx
│
├── render.yaml
├── .gitignore
└── README.md
```

---

## Resume Line

```
CareerLens – Career Management Platform | React, FastAPI, PostgreSQL, JWT, Python

• Built a production-ready full-stack career platform with resume upload, ATS compatibility 
  scoring, drag-and-drop Kanban application tracker, and analytics dashboard with Recharts.
• Developed secure REST APIs with FastAPI and JWT authentication, with PostgreSQL via 
  SQLAlchemy ORM and Pydantic schema validation.
• Implemented a configurable keyword-matching ATS engine comparing resume skills against 
  job descriptions with actionable improvement suggestions — no paid APIs required.
• Deployed frontend on Vercel and backend on Render with Neon PostgreSQL for zero-cost hosting.
```

---

## Extending With RAG (Future)

The architecture is designed to swap in AI later with minimal changes:

1. Add `chromadb` and `sentence-transformers` to `requirements.txt`
2. Create `app/services/rag_service.py` with embedding + retrieval logic
3. Add a new router `app/routers/assistant.py`
4. Wire a new frontend page `/assistant` to call it

The existing code structure does not need to change.

---

## Author

**Harsha Vardhan Repudi**
- GitHub: [github.com/HarshaVardhanRepudi](https://github.com/HarshaVardhanRepudi)
- LinkedIn: [linkedin.com/in/harsha-vardhan-repudi-b1b44b219](https://linkedin.com/in/harsha-vardhan-repudi-b1b44b219)
- Live Project: [cranecheck-inspection-form.vercel.app](https://cranecheck-inspection-form.vercel.app)
