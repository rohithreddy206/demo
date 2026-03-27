from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func

from database import Base


class Job(Base):
    """ORM model representing a job requirement record."""

    __tablename__ = "jobs"

    id                       = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date                     = Column(Date, nullable=False)
    company_name             = Column(String(150), nullable=False)
    job_title                = Column(String(150), nullable=False)
    num_candidates_required  = Column(Integer, nullable=False)
    experience               = Column(String(100), nullable=True)
    budgeted_package         = Column(String(100), nullable=True)
    assigned_recruiter_name  = Column(String(100), nullable=True)
    created_at               = Column(DateTime, server_default=func.now())
    updated_at               = Column(DateTime, onupdate=func.now())
