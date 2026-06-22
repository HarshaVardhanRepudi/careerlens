"""
ATS Keyword Matching Engine.
No paid APIs — uses a configurable skills dictionary and regex matching.
Designed to be swappable with an LLM-powered service later.
"""
import re
from typing import List, Dict

# ─── Configurable Skills Dictionary ────────────────────────────────────────────
# Add/remove skills here to tune matching accuracy.
SKILLS_DICT = {
    # Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "go",
    "rust", "swift", "kotlin", "scala", "php", "r", "matlab",

    # Frontend
    "react", "angular", "vue", "nextjs", "svelte", "html", "html5", "css",
    "css3", "tailwind", "bootstrap", "sass", "scss", "jquery", "redux",
    "webpack", "vite", "figma",

    # Backend
    "node", "nodejs", "django", "fastapi", "flask", "spring", "express",
    "rails", "laravel", "graphql", "rest api", "grpc", "websocket",

    # Databases
    "sql", "postgresql", "mysql", "sqlite", "mongodb", "redis", "dynamodb",
    "cassandra", "elasticsearch", "firebase", "supabase",

    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "github actions", "ci/cd", "linux", "nginx", "vercel", "render",

    # AI/ML
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "rag",
    "llm", "langchain", "openai", "hugging face", "vector database",
    "embeddings", "chromadb", "pinecone",

    # Tools & Practices
    "git", "github", "jira", "agile", "scrum", "tdd", "unit testing",
    "integration testing", "microservices", "system design", "oop",
    "data structures", "algorithms", "jwt", "oauth", "api",

    # Data
    "spark", "hadoop", "kafka", "airflow", "tableau", "power bi", "excel",
}


def _extract_skills(text: str) -> List[str]:
    """Find all known skills present in a block of text."""
    text_lower = text.lower()
    found = []
    for skill in SKILLS_DICT:
        # Use word-boundary matching for accuracy
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
    return sorted(set(found))


def analyze(resume_text: str, job_description: str) -> Dict:
    """
    Core ATS analysis function.
    Returns ats_score, matching_skills, missing_skills, suggestions.
    """
    resume_skills = set(_extract_skills(resume_text))
    job_skills = set(_extract_skills(job_description))

    if not job_skills:
        return {
            "ats_score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "suggestions": [
                "No recognizable technical skills were found in the job description.",
                "Try pasting the full job description including the requirements section.",
            ]
        }

    matching = sorted(resume_skills & job_skills)
    missing = sorted(job_skills - resume_skills)
    score = round(len(matching) / len(job_skills) * 100)
    suggestions = _generate_suggestions(score, missing, resume_text)

    return {
        "ats_score": score,
        "matching_skills": matching,
        "missing_skills": missing,
        "suggestions": suggestions,
    }


def _generate_suggestions(score: int, missing: List[str], resume_text: str) -> List[str]:
    """Generate actionable improvement suggestions."""
    tips = []

    # Score-based feedback
    if score >= 80:
        tips.append("Excellent match! Your resume aligns strongly with this role.")
    elif score >= 60:
        tips.append("Good match. A few targeted additions could make your application much stronger.")
    elif score >= 40:
        tips.append("Moderate match. Consider tailoring your resume specifically for this role.")
    else:
        tips.append("Low match. This role may require skills not currently on your resume.")

    # Missing skills
    if missing:
        top = missing[:5]
        tips.append(f"Add these skills if you have experience with them: {', '.join(top)}.")

    # Resume length
    word_count = len(resume_text.split())
    if word_count < 250:
        tips.append("Your resume appears short. Expand your project descriptions with measurable impact.")
    elif word_count > 900:
        tips.append("Your resume is long. Trim older or less relevant experience to keep it focused.")

    # GitHub / portfolio
    if "github" not in resume_text.lower():
        tips.append("Add your GitHub profile link to showcase your actual code.")

    # Quantified achievements
    has_numbers = bool(re.search(r'\b\d+\s*(%|users|apps|systems|projects|ms|seconds|hours)\b', resume_text.lower()))
    if not has_numbers:
        tips.append("Quantify your achievements (e.g., 'Reduced load time by 40%') to stand out.")

    # Action verbs
    action_verbs = ["built", "developed", "implemented", "designed", "deployed", "led", "optimized", "created"]
    if not any(v in resume_text.lower() for v in action_verbs):
        tips.append("Use strong action verbs like 'Built', 'Deployed', 'Designed' to describe your work.")

    return tips
