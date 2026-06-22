from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    resume_text = Column(Text, nullable=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())


class ATSResult(Base):
    __tablename__ = "ats_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_description = Column(Text, nullable=False)
    ats_score = Column(Integer, nullable=False)
    matching_skills = Column(Text, nullable=False)   # JSON string
    missing_skills = Column(Text, nullable=False)    # JSON string
    suggestions = Column(Text, nullable=False)       # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
