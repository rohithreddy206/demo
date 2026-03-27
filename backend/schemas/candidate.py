from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CandidateCreate(BaseModel):
    candidate_id: str            = Field(..., min_length=1, max_length=50)
    full_name: str               = Field(..., min_length=1, max_length=150)
    phone_number: str            = Field(..., min_length=7, max_length=20)
    email: str                       = Field(..., min_length=5, max_length=150)
    current_location: str        = Field(..., min_length=1, max_length=150)
    recruiter_name: str          = Field(..., min_length=1, max_length=100)

    current_company: Optional[str]     = None
    total_experience: Optional[str]    = None
    relevant_experience: Optional[float] = None
    highest_education: Optional[str]   = None
    skills: Optional[str]              = None   # comma-separated string

    current_ctc: Optional[float]       = None
    expected_ctc: Optional[float]      = None
    notice_period: Optional[str]       = None
    reason_for_job_change: Optional[str] = None


class CandidateOut(BaseModel):
    id: int
    candidate_id: str
    full_name: str
    phone_number: str
    email: str
    current_location: str
    recruiter_name: str

    current_company: Optional[str]
    total_experience: Optional[str]
    relevant_experience: Optional[float]
    highest_education: Optional[str]
    skills: Optional[str]
    status: str


    current_ctc: Optional[float]
    expected_ctc: Optional[float]
    notice_period: Optional[str]
    reason_for_job_change: Optional[str]

    resume_file: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
