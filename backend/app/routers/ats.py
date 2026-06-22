from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime
import json
from app.database import get_db
from app.models.resume import Resume, ATSResult
from app.models.user import User
from app.services.ats_service import analyze
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/ats", tags=["ATS Analyzer"])


class AnalyzeRequest(BaseModel):
    resume_id: int
    job_description: str


class AnalyzeResponse(BaseModel):
    id: int
    ats_score: int
    matching_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]
    created_at: datetime


@router.post("/analyze", response_model=AnalyzeResponse, status_code=201)
def analyze_resume(
    payload: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analyze resume against a job description and return ATS score."""
    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty")

    resume = db.query(Resume).filter(
        Resume.id == payload.resume_id, Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    result = analyze(resume.resume_text, payload.job_description)

    ats = ATSResult(
        user_id=current_user.id,
        resume_id=resume.id,
        job_description=payload.job_description,
        ats_score=result["ats_score"],
        matching_skills=json.dumps(result["matching_skills"]),
        missing_skills=json.dumps(result["missing_skills"]),
        suggestions=json.dumps(result["suggestions"]),
    )
    db.add(ats)
    db.commit()
    db.refresh(ats)

    return {
        "id": ats.id,
        "ats_score": ats.ats_score,
        "matching_skills": json.loads(ats.matching_skills),
        "missing_skills": json.loads(ats.missing_skills),
        "suggestions": json.loads(ats.suggestions),
        "created_at": ats.created_at,
    }


@router.get("/history", response_model=List[AnalyzeResponse])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recent ATS analysis history for the user."""
    results = db.query(ATSResult).filter(
        ATSResult.user_id == current_user.id
    ).order_by(ATSResult.created_at.desc()).limit(10).all()

    return [
        {
            "id": r.id,
            "ats_score": r.ats_score,
            "matching_skills": json.loads(r.matching_skills),
            "missing_skills": json.loads(r.missing_skills),
            "suggestions": json.loads(r.suggestions),
            "created_at": r.created_at,
        }
        for r in results
    ]
