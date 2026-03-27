from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class Candidate(Base):
    """ORM model representing a candidate profile."""

    __tablename__ = "candidates"

    id                    = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id          = Column(String(50), unique=True, nullable=False, index=True)
    full_name             = Column(String(150), nullable=False)
    phone_number          = Column(String(20), nullable=False)
    email                 = Column(String(150), nullable=False)
    current_location      = Column(String(150), nullable=False)
    recruiter_name        = Column(String(100), nullable=False)

    current_company       = Column(String(150), nullable=True)
    total_experience      = Column(String(50), nullable=True)
    relevant_experience   = Column(Float, nullable=True)
    highest_education     = Column(String(100), nullable=True)
    skills                = Column(Text, nullable=True)          # comma-separated
    status                = Column(String(50), default="Sourcing", nullable=False)

    current_ctc           = Column(Float, nullable=True)
    expected_ctc          = Column(Float, nullable=True)
    notice_period         = Column(String(50), nullable=True)
    reason_for_job_change = Column(Text, nullable=True)

    resume_file           = Column(String(255), nullable=True)   # stored filename

    created_at            = Column(DateTime, server_default=func.now())
    updated_at            = Column(DateTime, onupdate=func.now())
