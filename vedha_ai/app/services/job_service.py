import json

from app.ai.job_matcher import calculate_job_match
from app.ai.semantic_matcher import semantic_similarity
from app.repositories.job_repository import JobRepository
from app.ai.role_matcher import role_match_score, is_role_relevant

MIN_MATCH_PERCENT = 20


class JobService:

    def __init__(self, repository: JobRepository):
        self.repository = repository

    def recommend_jobs(
        self,
        student_id: int,
    ):
        db = self.repository.db

        # ── 1. Self-healing check: Seed realistic demo jobs once if database is empty ──
        from app.models.company_job import CompanyJob
        if db.query(CompanyJob).count() == 0:
            self._seed_demo_company_jobs(db)

        # ── 2. Get student context ───────────────────────────────────────────────────
        from app.models.profile import Profile
        from app.models.skill import Skill
        
        resume = self.repository.get_latest_resume(student_id)
        profile = db.query(Profile).filter(Profile.user_id == student_id).first()
        student_skills_query = db.query(Skill).filter(Skill.user_id == student_id).all()

        target_role = None
        resume_skills = []
        resume_ats_score = 0.0

        if resume:
            target_role = resume.target_role
            try:
                resume_skills = json.loads(resume.matched_skills)
            except Exception:
                if resume.matched_skills:
                    resume_skills = [s.strip() for s in resume.matched_skills.split(",") if s.strip()]
            resume_ats_score = float(resume.match_percent or 0)

        if not target_role and profile:
            target_role = profile.target_role

        if not target_role:
            target_role = "Backend Engineer"

        # Compile candidate skills from resume, skills table, and profile fields
        candidate_skills = set(resume_skills)
        for s in student_skills_query:
            candidate_skills.add(s.skill_name)
        if profile and profile.skills:
            for s in profile.skills.split(","):
                if s.strip():
                    candidate_skills.add(s.strip())

        is_beginner = len(candidate_skills) == 0
        candidate_skills_list = list(candidate_skills)

        # ── 3. Query all active company jobs ─────────────────────────────────────────
        jobs = db.query(CompanyJob).filter(CompanyJob.is_active == True).all()
        recommendations = []

        for job in jobs:
            job_title = job.title
            job_desc = job.description
            job_skills = []
            if job.skills:
                job_skills = [s.strip() for s in job.skills.split(",") if s.strip()]

            # If the student is a complete beginner, recommend matching roles with default scores
            if is_beginner:
                level_lower = (job.experience_level or "").lower()
                type_lower = (job.employment_type or "").lower()
                is_beginner_job = (
                    "fresher" in level_lower or
                    "intern" in level_lower or
                    "junior" in level_lower or
                    "1-3" in level_lower or
                    "internship" in type_lower
                )

                if is_beginner_job or is_role_relevant(target_role, job_title):
                    default_score = 75.0
                    if is_role_relevant(target_role, job_title):
                        default_score += 5.0
                    if "fresher" in level_lower or "intern" in level_lower:
                        default_score += 5.0

                    company_name = job.company.company_name if job.company else "Vedha AI Partner"
                    recommendations.append(
                        {
                            "id": job.id,
                            "title": job.title,
                            "company": company_name,
                            "location": job.location,
                            "salary": job.salary,
                            "job_type": job.employment_type,
                            "source": "Vedha Recruiter Portal",
                            "url": "",
                            "match_percent": default_score,
                            "exact_match_score": default_score,
                            "semantic_score": default_score,
                            "role_score": default_score,
                            "matched_skills": list(set(job_skills).intersection({"Python", "React", "FastAPI", "SQL", "JavaScript", "HTML", "CSS"})),
                        }
                    )
                continue

            # Regular matching score calculation
            if not is_role_relevant(target_role, job_title):
                continue

            result = calculate_job_match(
                candidate_skills_list,
                job_skills,
            )

            semantic_score = semantic_similarity(
                candidate_skills_list,
                job_skills,
            )

            role_score = role_match_score(
                target_role=target_role,
                job_title=job_title,
                job_skills=job_skills,
                description=job_desc,
            )

            final_score = round(
                (role_score * 0.3)
                + (result["match_percent"] * 0.3)
                + (semantic_score * 0.2)
                + (resume_ats_score * 0.2),
                1,
            )

            if final_score >= 50.0:
                company_name = job.company.company_name if job.company else "Vedha AI Partner"
                recommendations.append(
                    {
                        "id": job.id,
                        "title": job.title,
                        "company": company_name,
                        "location": job.location,
                        "salary": job.salary,
                        "job_type": job.employment_type,
                        "source": "Vedha Recruiter Portal",
                        "url": "",
                        "match_percent": final_score,
                        "exact_match_score": result["match_percent"],
                        "semantic_score": semantic_score,
                        "role_score": role_score,
                        "matched_skills": result["matched_skills"],
                    }
                )

        recommendations.sort(
            key=lambda item: item["match_percent"],
            reverse=True,
        )

        return {
            "student_id": student_id,
            "target_role": target_role,
            "recommended_jobs": recommendations[:10],
        }

    def _seed_demo_company_jobs(self, db):
        from app.models.user import User
        from app.models.company_profile import CompanyProfile
        from app.models.company_job import CompanyJob

        # 1. Get or create primary company user
        company_user = db.query(User).filter(User.role == "company").first()
        if not company_user:
            company_user = User(
                name="DeepMind Tech Careers",
                email="recruitment@deepmind.com",
                password_hash="$2b$12$lnZThpOF13DGWSKPxFY0aO/IDXSFBpk.IaHHbqTjj/GBvSMyjnFi",
                role="company",
                status="active",
                is_verified=True
            )
            db.add(company_user)
            db.flush()

        # 2. Check or create Company Profile
        company_profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == company_user.id).first()
        if not company_profile:
            company_profile = CompanyProfile(
                user_id=company_user.id,
                company_name="Google DeepMind",
                industry="Artificial Intelligence",
                website="https://deepmind.google",
                location="Bangalore, India",
                description="Google's AI Research lab developing cutting-edge AI systems.",
                company_size="1000-5000",
                is_verified=True,
                verification_status="approved"
            )
            db.add(company_profile)
            db.flush()

        # Create secondary company profile using company2@test.com
        company2_user = db.query(User).filter(User.email == "company2@test.com").first()
        if not company2_user:
            company2_user = User(
                name="Meta Careers India",
                email="company2@test.com",
                password_hash="$2b$12$lnZThpOF13DGWSKPxFY0aO/IDXSFBpk.IaHHbqTjj/GBvSMyjnFi",
                role="company",
                status="active",
                is_verified=True
            )
            db.add(company2_user)
            db.flush()

        company2_profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == company2_user.id).first()
        if not company2_profile:
            company2_profile = CompanyProfile(
                user_id=company2_user.id,
                company_name="Meta India",
                industry="Social Technology & VR",
                website="https://meta.com",
                location="Hyderabad, India",
                description="Meta builds social technologies and VR/AR workspaces.",
                company_size="5000+",
                is_verified=True,
                verification_status="approved"
            )
            db.add(company2_profile)
            db.flush()

        # 3. Seed realistic jobs
        demo_jobs = [
            {
                "company_id": company_profile.id,
                "title": "Backend Developer",
                "description": "Seeking Python Backend Engineer to scale FastAPI, PostgreSQL, and Docker integrations.",
                "location": "Bangalore (Remote)",
                "employment_type": "Full-time",
                "experience_level": "Fresher",
                "salary": "12 - 18 LPA",
                "skills": "Python, FastAPI, SQL, PostgreSQL, Docker"
            },
            {
                "company_id": company2_profile.id,
                "title": "Frontend Engineer",
                "description": "Build high performance React web interfaces using Vite, TypeScript, and TailwindCSS.",
                "location": "Hyderabad",
                "employment_type": "Full-time",
                "experience_level": "1-3 Years",
                "salary": "10 - 15 LPA",
                "skills": "React, TypeScript, JavaScript, HTML, CSS, Vite"
            },
            {
                "company_id": company_profile.id,
                "title": "Machine Learning Engineer",
                "description": "Optimize deep learning models, transformers, and CNN pipelines using PyTorch and Scikit-Learn.",
                "location": "Bangalore",
                "employment_type": "Full-time",
                "experience_level": "3-5 Years",
                "salary": "18 - 25 LPA",
                "skills": "Python, PyTorch, Machine Learning, Scikit-Learn, Deep Learning"
            },
            {
                "company_id": company2_profile.id,
                "title": "Data Science Intern",
                "description": "Analyze user behavior metrics, write clean SQL pipelines, and clean datasets with Pandas.",
                "location": "Hyderabad (Remote)",
                "employment_type": "Internship",
                "experience_level": "Fresher",
                "salary": "4 - 6 LPA",
                "skills": "Python, SQL, Pandas, NumPy, Data Analysis"
            },
            {
                "company_id": company_profile.id,
                "title": "NLP Developer",
                "description": "Build Retrieval-Augmented Generation (RAG) pipelines, LangChain applications, and fine-tune LLMs.",
                "location": "Bangalore",
                "employment_type": "Full-time",
                "experience_level": "1-3 Years",
                "salary": "14 - 20 LPA",
                "skills": "Python, NLP, Transformers, RAG, LangChain"
            }
        ]

        for dj in demo_jobs:
            job = CompanyJob(
                company_id=dj["company_id"],
                title=dj["title"],
                description=dj["description"],
                location=dj["location"],
                employment_type=dj["employment_type"],
                experience_level=dj["experience_level"],
                salary=dj["salary"],
                skills=dj["skills"],
                vacancies=1,
                is_active=True
            )
            db.add(job)
        db.commit()