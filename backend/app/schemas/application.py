from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

VALID_STATUSES = ["Saved", "Applied", "Interview", "Rejected", "Offer"]


class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str = "Saved"
    date_applied: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def status_valid(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v

    @field_validator("company", "role")
    @classmethod
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    date_applied: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def status_valid(cls, v):
        if v and v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v


class ApplicationResponse(BaseModel):
    id: int
    company: str
    role: str
    status: str
    date_applied: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
