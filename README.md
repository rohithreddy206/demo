# RecruitPro — Recruitment Management System

A client-ready demo covering **UC 6.1 (Create Job Requirement)** and **UC 6.2 (Update Job Requirement)**, built with FastAPI, MySQL, and vanilla HTML/CSS/JS.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.10+ |
| MySQL | 8.0+ |

---

## Setup & Run

### 1 — Clone / Open the project
```bash
cd recruitment-system
```

### 2 — Create a virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3 — Install dependencies
```bash
pip install -r backend/requirements.txt
```

### 4 — Configure the database URL

Open `backend/.env` and fill in your MySQL credentials:
```env
DB_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/recruitment_db
```

### 5 — Create the database & seed data

In **MySQL Workbench** or the MySQL CLI:
```sql
SOURCE database/schema.sql;
```
Or from a terminal:
```bash
mysql -u root -p < database/schema.sql
```

### 6 — Start the backend
```bash
cd backend
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.  
Interactive docs: `http://127.0.0.1:8000/docs`

### 7 — Open the frontend

Open `frontend/index.html` in any modern browser (Chrome, Edge, Firefox).

---

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Manager | manager@demo.com | demo1234 |
| Recruiter | recruiter@demo.com | demo1234 |

---

## Folder Structure

```
recruitment-system/
│
├── backend/
│   ├── main.py                  # FastAPI app: CORS, router registration
│   ├── database.py              # SQLAlchemy engine + session factory
│   ├── models/job.py            # Job ORM model
│   ├── schemas/job.py           # Pydantic v2 schemas (Create / Update / Response)
│   ├── routers/
│   │   ├── auth.py              # POST /api/auth/login (mock)
│   │   └── jobs.py              # POST, GET, PUT /api/jobs + dashboard stats
│   ├── services/job_service.py  # All business logic (no raw SQL)
│   ├── core/config.py           # Settings loaded from .env
│   ├── requirements.txt
│   └── .env                     # Your DB credentials (never committed)
│
├── frontend/
│   ├── index.html               # Login page
│   ├── dashboard.html           # Dashboard with job count
│   ├── create-job.html          # UC 6.1 — Create Job
│   ├── update-job.html          # UC 6.2 — Search & Update Job
│   ├── css/
│   │   ├── global.css           # Design tokens, sidebar, toasts
│   │   ├── auth.css             # Login page styles
│   │   ├── dashboard.css        # Stat card styles
│   │   └── forms.css            # Form, table, edit panel styles
│   └── js/
│       ├── api.js               # Fetch helper (base URL + error handling)
│       ├── auth.js              # Session management + login/logout
│       ├── dashboard.js         # Stats fetch + render
│       ├── create-job.js        # UC 6.1 form logic
│       └── update-job.js        # UC 6.2 search / edit / save logic
│
├── database/
│   └── schema.sql               # CREATE / DROP tables + seed data
│
└── README.md
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Mock login |
| POST | `/api/jobs` | Create job (UC 6.1) |
| GET | `/api/jobs` | List jobs (`?date=` & `?company=` filters) |
| GET | `/api/jobs/{id}` | Get single job |
| PUT | `/api/jobs/{id}` | Update job (UC 6.2) |
| GET | `/api/dashboard/stats` | Total job count |

All responses follow the envelope: `{ "status", "data", "message" }`.
