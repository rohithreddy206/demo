from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    """Schema for creating a new job requirement."""

    date: date
    company_name: str = Field(..., min_length=1, max_length=150)
    job_title: str = Field(..., min_length=1, max_length=150)
    num_candidates_required: int = Field(..., ge=1)
    experience: Optional[str] = Field(None, max_length=100)
    budgeted_package: Optional[str] = Field(None, max_length=100)
    assigned_recruiter_name: Optional[str] = Field(None, max_length=100)


class JobUpdate(BaseModel):
    """Schema for updating an existing job requirement (partial fields)."""

    job_title: Optional[str] = Field(None, min_length=1, max_length=150)
    num_candidates_required: Optional[int] = Field(None, ge=1)
    experience: Optional[str] = Field(None, max_length=100)
    budgeted_package: Optional[str] = Field(None, max_length=100)


class JobResponse(BaseModel):
    """Schema for returning a job record in API responses."""

    id: int
    date: date
    company_name: str
    job_title: str
    num_candidates_required: int
    experience: Optional[str]
    budgeted_package: Optional[str]
    assigned_recruiter_name: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}
