from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from schemas.job import JobCreate, JobUpdate, JobResponse
from services import job_service

router = APIRouter(prefix="/api", tags=["jobs"])


def _envelope(status: str, data, message: str) -> dict:
    """Build a standard API response envelope."""
    return {"status": status, "data": data, "message": message}


@router.post("/jobs", response_model=dict)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    """Create a new job requirement (UC 6.1)."""
    job = job_service.create_job(db, payload)
    return _envelope("success", JobResponse.model_validate(job).model_dump(mode="json"), "Job requirement created successfully.")


@router.get("/jobs", response_model=dict)
def list_jobs(date: Optional[str] = None, company: Optional[str] = None, db: Session = Depends(get_db)):
    """List all jobs with optional filters for date and company name (UC 6.2 search)."""
    jobs = job_service.get_jobs(db, date=date, company=company)
    data = [JobResponse.model_validate(j).model_dump(mode="json") for j in jobs]
    return _envelope("success", data, f"{len(data)} record(s) found.")


@router.get("/jobs/{job_id}", response_model=dict)
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Retrieve a single job record by its ID."""
    job = job_service.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return _envelope("success", JobResponse.model_validate(job).model_dump(mode="json"), "Job found.")


@router.put("/jobs/{job_id}", response_model=dict)
def update_job(job_id: int, payload: JobUpdate, db: Session = Depends(get_db)):
    """Update an existing job requirement (UC 6.2)."""
    job = job_service.update_job(db, job_id, payload)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return _envelope("success", JobResponse.model_validate(job).model_dump(mode="json"), "Job updated successfully.")


from services import candidate_service

@router.get("/dashboard/stats", response_model=dict)
def dashboard_stats(db: Session = Depends(get_db)):
    """Return aggregate statistics for the dashboard summary cards."""
    total_jobs = job_service.count_jobs(db)
    total_candidates = candidate_service.count_candidates(db)
    
    # Using the status column we added to the database
    total_interviews = candidate_service.count_candidates_by_status(db, "Interview")
    total_offers     = candidate_service.count_candidates_by_status(db, "Offer")
    
    return _envelope("success", {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "total_interviews": total_interviews,
        "total_offers": total_offers
    }, "Stats retrieved.")
