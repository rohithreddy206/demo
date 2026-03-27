import os
import shutil
from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.candidate import Candidate
from schemas.candidate import CandidateCreate

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads", "resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def create_candidate(db: Session, data: CandidateCreate, resume_filename: str | None) -> Candidate:
    # Check duplicate candidate_id
    existing = db.query(Candidate).filter(Candidate.candidate_id == data.candidate_id).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Candidate ID '{data.candidate_id}' already exists.")

    candidate = Candidate(
        candidate_id=data.candidate_id,
        full_name=data.full_name,
        phone_number=data.phone_number,
        email=data.email,
        current_location=data.current_location,
        recruiter_name=data.recruiter_name,
        current_company=data.current_company,
        total_experience=data.total_experience,
        relevant_experience=data.relevant_experience,
        highest_education=data.highest_education,
        skills=data.skills,
        current_ctc=data.current_ctc,
        expected_ctc=data.expected_ctc,
        notice_period=data.notice_period,
        reason_for_job_change=data.reason_for_job_change,
        resume_file=resume_filename,
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def get_all_candidates(db: Session) -> List[Candidate]:
    return db.query(Candidate).order_by(Candidate.created_at.desc()).all()


def get_candidate_by_id(db: Session, candidate_id: str) -> Candidate:
    c = db.query(Candidate).filter(Candidate.candidate_id == candidate_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return c


def count_candidates(db: Session) -> int:
    return db.query(Candidate).count()

def count_candidates_by_status(db: Session, status: str) -> int:
    return db.query(Candidate).filter(Candidate.status == status).count()

