import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from schemas.candidate import CandidateOut
from services import candidate_service

router = APIRouter(prefix="/api/candidates", tags=["candidates"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads", "resumes")
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("", response_model=CandidateOut, status_code=201)
def register_candidate(
    # ── Personal ──
    candidate_id:          str           = Form(...),
    full_name:             str           = Form(...),
    phone_number:          str           = Form(...),
    email:                 str           = Form(...),
    current_location:      str           = Form(...),
    recruiter_name:        str           = Form(...),
    # ── Professional ──
    current_company:       Optional[str] = Form(None),
    total_experience:      Optional[str] = Form(None),
    relevant_experience:   Optional[float] = Form(None),
    highest_education:     Optional[str] = Form(None),
    skills:                Optional[str] = Form(None),
    # ── Compensation ──
    current_ctc:           Optional[float] = Form(None),
    expected_ctc:          Optional[float] = Form(None),
    notice_period:         Optional[str] = Form(None),
    reason_for_job_change: Optional[str] = Form(None),
    # ── Resume ──
    resume:                Optional[UploadFile] = File(None),
    db:                    Session = Depends(get_db),
):
    # Handle resume upload
    resume_filename: Optional[str] = None
    if resume and resume.filename:
        ext = os.path.splitext(resume.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Only PDF, DOC, DOCX resumes are accepted.")
        contents = resume.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Resume must be under 5 MB.")
        safe_name = f"{uuid.uuid4().hex}{ext}"
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        with open(os.path.join(UPLOAD_DIR, safe_name), "wb") as f:
            f.write(contents)
        resume_filename = safe_name

    from schemas.candidate import CandidateCreate
    data = CandidateCreate(
        candidate_id=candidate_id,
        full_name=full_name,
        phone_number=phone_number,
        email=email,
        current_location=current_location,
        recruiter_name=recruiter_name,
        current_company=current_company,
        total_experience=total_experience,
        relevant_experience=relevant_experience,
        highest_education=highest_education,
        skills=skills,
        current_ctc=current_ctc,
        expected_ctc=expected_ctc,
        notice_period=notice_period,
        reason_for_job_change=reason_for_job_change,
    )
    return candidate_service.create_candidate(db, data, resume_filename)


@router.get("", response_model=List[CandidateOut])
def list_candidates(db: Session = Depends(get_db)):
    return candidate_service.get_all_candidates(db)


@router.get("/{candidate_id}", response_model=CandidateOut)
def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    return candidate_service.get_candidate_by_id(db, candidate_id)
