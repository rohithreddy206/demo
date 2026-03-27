import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.config import settings
from database import Base, engine
from routers import auth, jobs, candidates  # ← added candidates

# Create all tables (jobs + candidates) if they don't exist
import models.job        # noqa: F401 – register Job model
import models.candidate  # noqa: F401 – register Candidate model
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version="1.0.0")

# Allow all localhost origins for the demo frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "null",           # file:// origin used when opening HTML directly
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routers must be registered BEFORE the static mount so they take priority
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(candidates.router)  # ← added

# Resolve frontend folder relative to this file (backend/../frontend)
FRONTEND_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

# Mount frontend at root — index.html is served at /, all CSS/JS resolve normally
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

