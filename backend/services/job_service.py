from typing import Optional
from sqlalchemy.orm import Session

from models.job import Job
from schemas.job import JobCreate, JobUpdate


def create_job(db: Session, payload: JobCreate) -> Job:
    """Persist a new job requirement to the database and return it."""
    job = Job(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_jobs(db: Session, date: Optional[str] = None, company: Optional[str] = None) -> list[Job]:
    """Query all jobs, optionally filtered by date and/or company name (case-insensitive)."""
    query = db.query(Job)
    if date:
        query = query.filter(Job.date == date)
    if company:
        query = query.filter(Job.company_name.ilike(f"%{company}%"))
    return query.order_by(Job.created_at.desc()).all()


def get_job_by_id(db: Session, job_id: int) -> Optional[Job]:
    """Fetch a single job record by its primary key."""
    return db.query(Job).filter(Job.id == job_id).first()


def update_job(db: Session, job_id: int, payload: JobUpdate) -> Optional[Job]:
    """Apply partial updates to a job record and return the updated record."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return None
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job


def count_jobs(db: Session) -> int:
    """Return the total count of job records in the database."""
    return db.query(Job).count()
