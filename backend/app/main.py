"""
CareerLens — Career Management Platform
FastAPI backend entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# Import models so SQLAlchemy creates tables
from app.models import user, resume, application  # noqa: F401

# Import routers
from app.routers import auth, resume as resume_router, ats, tracker, analytics

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerLens API",
    description="Career Management Platform — No paid AI APIs required.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(resume_router.router)
app.include_router(ats.router)
app.include_router(tracker.router)
app.include_router(analytics.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "CareerLens API is running", "docs": "/docs"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
