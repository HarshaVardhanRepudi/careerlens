from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import Counter
import json
from app.database import get_db
from app.models.application import Application
from app.models.resume import ATSResult
from app.models.user import User
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

STATUSES = ["Saved", "Applied", "Interview", "Rejected", "Offer"]


@router.get("")
def get_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Aggregate analytics for the authenticated user's job search."""
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    total = len(apps)

    # Status counts
    status_counts = Counter(a.status for a in apps)
    interviews = status_counts.get("Interview", 0)
    offers = status_counts.get("Offer", 0)

    status_distribution = [
        {"status": s, "count": status_counts.get(s, 0)} for s in STATUSES
    ]

    # Application trend by month
    monthly = Counter()
    for app in apps:
        if app.date_applied:
            month = app.date_applied[:7]  # "2026-06"
            monthly[month] += 1
    application_trend = [
        {"month": k, "count": v} for k, v in sorted(monthly.items())
    ]

    # Top missing skills across all ATS analyses
    ats_results = db.query(ATSResult).filter(ATSResult.user_id == current_user.id).all()
    all_missing = []
    for r in ats_results:
        try:
            all_missing.extend(json.loads(r.missing_skills))
        except Exception:
            pass
    top_missing = [
        {"skill": skill, "count": count}
        for skill, count in Counter(all_missing).most_common(8)
    ]

    return {
        "total_applications": total,
        "interview_rate": round(interviews / total * 100, 1) if total else 0,
        "offer_rate": round(offers / total * 100, 1) if total else 0,
        "status_distribution": status_distribution,
        "application_trend": application_trend,
        "top_missing_skills": top_missing,
    }
