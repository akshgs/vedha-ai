import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.base import Base
from app.database.database import engine, SessionLocal

# Import models so SQLAlchemy registers them
from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.models.job import Job
from app.models.interview import InterviewSession, InterviewAnswer
from app.models.roadmap import Roadmap
from app.models.profile import Profile
from app.models.education import Education
from app.models.experience import Experience
from app.models.project import Project
from app.models.certification import Certification
from app.models.skill import Skill

# Company Models
from app.models.company_profile import CompanyProfile
from app.models.company_job import CompanyJob
from app.models.application import Application

# Phase 9 — AI Platform Models
from app.models.ai_history import AIInteraction
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.notification import Notification

# New Models
from app.models.course import Course, Lesson, UserCourseProgress, CourseBookmark, CourseDiscussion
from app.models.recruitment_interview import RecruitmentInterviewSlot
from app.models.recruitment_offer import RecruitmentOffer

# Social and messaging models
from app.models.networking import Post, PostLike, Community, CommunityMember, UserConnection
from app.models.mentorship import MentorProfile, MentorBookingSlot, MentorshipSession, MentorReview
from app.models.messages import Conversation, DirectMessage
from app.models.ecosystem import VerifiedBadge, EcosystemStage


def seed_data(db: Session) -> None:
    # 1. Seed Problems
    if db.query(Problem).count() == 0:
        p1 = Problem(
            title="Two Sum",
            slug="two-sum",
            description="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
            difficulty="easy",
            tags=json.dumps(["Arrays", "Hashing"]),
            examples=json.dumps([
                {"input": {"nums": [2, 7, 11, 15], "target": 9}, "output": [0, 1]},
                {"input": {"nums": [3, 2, 4], "target": 6}, "output": [1, 2]}
            ]),
            constraints="2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
            hints=json.dumps(["Try hashing the numbers as you scan them."]),
            starter_code=json.dumps({
                "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass",
                "javascript": "function twoSum(nums, target) {\n    \n}"
            }),
            acceptance_rate=48,
            is_active=True
        )

        p2 = Problem(
            title="Longest Substring Without Repeating Characters",
            slug="longest-substring-without-repeating-characters",
            description="Given a string `s`, find the length of the longest substring without repeating characters.",
            difficulty="medium",
            tags=json.dumps(["Sliding Window", "Strings"]),
            examples=json.dumps([
                {"input": "abcabcbb", "output": 3},
                {"input": "bbbbb", "output": 1}
            ]),
            constraints="0 <= s.length <= 5 * 10^4",
            hints=json.dumps(["Use sliding window technique with a set."]),
            starter_code=json.dumps({
                "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
                "javascript": "function lengthOfLongestSubstring(s) {\n    \n}"
            }),
            acceptance_rate=34,
            is_active=True
        )

        p3 = Problem(
            title="Merge k Sorted Lists",
            slug="merge-k-sorted-lists",
            description="You are given an array of `k` sorted integer arrays. Merge all the arrays into one sorted array and return it.",
            difficulty="hard",
            tags=json.dumps(["Heap", "Priority Queue"]),
            examples=json.dumps([
                {"input": [[1, 4, 5], [1, 3, 4], [2, 6]], "output": [1, 1, 2, 3, 4, 4, 5, 6]}
            ]),
            constraints="k == lists.length\n0 <= k <= 10^4",
            hints=json.dumps(["Use a priority queue to keep track of the min elements."]),
            starter_code=json.dumps({
                "python": "class Solution:\n    def mergeKLists(self, lists: list) -> list:\n        pass",
                "javascript": "function mergeKLists(lists) {\n    \n}"
            }),
            acceptance_rate=42,
            is_active=True
        )

        db.add_all([p1, p2, p3])
        db.commit()
        print("[SEED] Seeded Coding Problems successfully.")

    # 2. Seed Courses & Lessons
    if db.query(Course).count() == 0:
        c1 = Course(
            id=101,
            title="Vite + React: The Complete Guide",
            category="Frontend Design",
            provider="Vedha Learning Platform",
            duration="24h video lessons",
            level="Beginner",
            description="Deep-dive into component lifecycle, hooks, global states, and deployment configurations.",
            is_active=True
        )
        c2 = Course(
            id=102,
            title="Advanced System Design & Microservices",
            category="Backend Development",
            provider="Industry Experts",
            duration="18h lessons",
            level="Expert",
            description="Master distributed architectures, caching strategies, load balancing, message queues, and high-availability systems.",
            is_active=True
        )
        c3 = Course(
            id=103,
            title="Python Backends with FastAPI & SQL",
            category="Backend Development",
            provider="Vedha AI Academics",
            duration="15h video lessons",
            level="Intermediate",
            description="Learn dependency injection, database transactions, background tasks, and clean architecture.",
            is_active=True
        )
        c4 = Course(
            id=104,
            title="AWS Cloud Operations & DevOps",
            category="Cloud Infrastructure",
            provider="Vedha AI Academics",
            duration="12h video lessons",
            level="Intermediate",
            description="Build scalable AWS cloud setups using Docker containerization, Kubernetes, and CI/CD pipelines.",
            is_active=True
        )
        db.add_all([c1, c2, c3, c4])
        db.commit()

        # Add Lessons
        l1 = Lesson(
            id=1,
            course_id=101,
            title="Module Overview & Frameworks setup",
            video_url="https://www.w3schools.com/html/mov_bbb.mp4",
            duration="12 mins",
            notes="Setup Vite using npm run dev command and build initial React DOM framework.",
            is_active=True
        )
        l2 = Lesson(
            id=2,
            course_id=101,
            title="Components State, Props, and Yield hooks",
            video_url="https://www.w3schools.com/html/mov_bbb.mp4",
            duration="24 mins",
            notes="Understand how component render processes happen on state modification.",
            is_active=True
        )
        l3 = Lesson(
            id=3,
            course_id=101,
            title="Advanced Context setup and global state managers",
            video_url="https://www.w3schools.com/html/mov_bbb.mp4",
            duration="32 mins",
            notes="Jot down notes about React Context vs Redux/Zustand.",
            is_active=True
        )
        l4 = Lesson(
            id=10,
            course_id=103,
            title="FastAPI Yield Dependency Injection",
            video_url="https://www.w3schools.com/html/mov_bbb.mp4",
            duration="15 mins",
            notes="Secure database connections cleanup using contextmanager yields.",
            is_active=True
        )
        db.add_all([l1, l2, l3, l4])
        db.commit()
        print("[SEED] Seeded Courses and Lessons successfully.")

    # 3. Seed Recruiter Jobs & Slots
    if db.query(CompanyProfile).count() == 0:
        # Create Google DeepMind Profile
        # Look for a recruiter/admin user first
        user = db.query(User).filter(User.role == "admin").first()
        if not user:
            # Check for any user
            user = db.query(User).first()
            
        if user:
            company = CompanyProfile(
                user_id=user.id,
                company_name="Google DeepMind",
                industry="Artificial Intelligence",
                website="https://deepmind.google",
                location="Bangalore",
                description="Google's AI research lab developing clean, robust systems.",
                is_verified=True,
                verification_status="approved"
            )
            db.add(company)
            db.commit()

            # Create Job
            job = CompanyJob(
                company_id=company.id,
                title="Backend Developer",
                description="We are seeking an async Python developer with FastAPI and PostgreSQL expertise.",
                location="Bangalore",
                employment_type="Full-time",
                experience_level="3-5 Years",
                salary="18-24 LPA",
                skills="Python, FastAPI, SQL, PostgreSQL",
                is_active=True
            )
            db.add(job)
            db.commit()

            # Seed Available Slots
            s1 = RecruitmentInterviewSlot(
                company_job_id=job.id,
                date="2026-07-28",
                time="10:00 AM",
                interviewer_name="Pranav M.",
                status="available"
            )
            s2 = RecruitmentInterviewSlot(
                company_job_id=job.id,
                date="2026-07-28",
                time="02:30 PM",
                interviewer_name="Pranav M.",
                status="available"
            )
            s3 = RecruitmentInterviewSlot(
                company_job_id=job.id,
                date="2026-07-29",
                time="11:00 AM",
                interviewer_name="Amit S.",
                status="available"
            )
            db.add_all([s1, s2, s3])
            db.commit()
            print("[SEED] Seeded Company Jobs and Interview Slots successfully.")

    # 4. Seed Communities
    if db.query(Community).count() == 0:
        c1 = Community(name="FastAPI Creators Ecosystem", description="Discuss database connection pools, async configurations, and route parameters.", members_count=1402)
        c2 = Community(name="Transformers Inference & Deployment", description="Deploy PyTorch models to AWS Cloud clusters under Kubernetes architectures.", members_count=843)
        db.add_all([c1, c2])
        db.commit()
        print("[SEED] Seeded Communities successfully.")

    # 5. Seed Mentors
    if db.query(MentorProfile).count() == 0:
        m1_user = db.query(User).filter(User.email == "pranav@test.com").first()
        if not m1_user:
            m1_user = User(name="Pranav M.", email="pranav@test.com", password_hash="$2b$12$lnZThpOF13DGWSKPxFY0aO/IDXSFBpk.IaHHbqTjj/GBvSMyjnFi", role="employee", status="active")
            db.add(m1_user)
            db.commit()
        
        m2_user = db.query(User).filter(User.email == "siddharth@test.com").first()
        if not m2_user:
            m2_user = User(name="Siddharth K.", email="siddharth@test.com", password_hash="$2b$12$lnZThpOF13DGWSKPxFY0aO/IDXSFBpk.IaHHbqTjj/GBvSMyjnFi", role="employee", status="active")
            db.add(m2_user)
            db.commit()

        mp1 = MentorProfile(user_id=m1_user.id, company="Google DeepMind", rating=4.9, reviews_count=42, bio="Principal researcher helping students navigate backend Rest API architectures and system scaling deployments.", skills="FastAPI, Python, Deep Learning")
        mp2 = MentorProfile(user_id=m2_user.id, company="Meta", rating=4.8, reviews_count=31, bio="Lead engineer optimizing UI render cycles, caching networks, and responsive layouts design.", skills="React, TypeScript, Performance")
        db.add_all([mp1, mp2])
        db.commit()

        # Seed Mentor booking slots
        slot1 = MentorBookingSlot(mentor_id=m1_user.id, date="2026-07-28", time="10:00 AM", booked=False)
        slot2 = MentorBookingSlot(mentor_id=m1_user.id, date="2026-07-28", time="02:30 PM", booked=False)
        slot3 = MentorBookingSlot(mentor_id=m2_user.id, date="2026-07-29", time="11:00 AM", booked=False)
        db.add_all([slot1, slot2, slot3])
        db.commit()
        print("[SEED] Seeded Mentors and Slots successfully.")

    # 6. Seed sample feed posts
    if db.query(Post).count() == 0:
        user = db.query(User).first()
        if user:
            post1 = Post(author_id=user.id, text="Just completed the Python FastAPI upskilling roadmap inside Vedha Academy! Strongly recommend checking out the yield dependency sessions.", likes_count=24, comments_count=3)
            db.add(post1)
            db.commit()
            print("[SEED] Seeded sample posts successfully.")

    # 7. Seed Curated Job Listings (for recommendations)
    if db.query(Job).filter(Job.title == "Machine Learning Engineer").count() == 0:
        # Clear existing ones first to have clean, realistic records
        db.query(Job).delete()
        db.commit()

        demo_jobs = [
            Job(
                title="Machine Learning Engineer",
                company="OpenAI",
                location="Remote",
                description="Join the team training next-generation large language models. You will optimize inference, build data pipelines, and implement scaling laws.",
                skills=json.dumps(["Python", "PyTorch", "FastAPI", "Transformers", "LLMs"]),
                salary="24-32 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="AI Research Engineer",
                company="Google DeepMind",
                location="Bangalore",
                description="Develop advanced reinforcement learning agents and multi-modal models for scientific breakthroughs.",
                skills=json.dumps(["Python", "PyTorch", "TensorFlow", "Deep Learning", "Statistics"]),
                salary="28-36 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Junior Machine Learning Developer",
                company="Vedha AI Inc",
                location="Mumbai",
                description="Train and evaluate fine-tuned language models for career guidance applications.",
                skills=json.dumps(["Python", "PyTorch", "scikit-learn", "FastAPI", "SQL"]),
                salary="8-12 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Data Scientist",
                company="Meta",
                location="Hyderabad",
                description="Apply advanced statistical analysis and machine learning to improve user engagement and product growth.",
                skills=json.dumps(["Python", "SQL", "Machine Learning", "Pandas", "Numpy", "Statistics"]),
                salary="20-26 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Lead Data Scientist",
                company="Netflix",
                location="Remote",
                description="Design personalization and recommendation algorithms for our millions of active viewers globally.",
                skills=json.dumps(["Python", "Machine Learning", "Deep Learning", "Apache Spark", "SQL"]),
                salary="30-40 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Backend Developer",
                company="Spotify",
                location="Remote",
                description="Build high-performance, asynchronous streaming API endpoints using FastAPI and PostgreSQL.",
                skills=json.dumps(["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "REST API"]),
                salary="15-20 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Python Backend Engineer",
                company="Robinhood",
                location="Bangalore",
                description="Design secure transaction pipelines and trade processing microservices with Django and Celery.",
                skills=json.dumps(["Python", "Django", "SQL", "Docker", "REST API", "PostgreSQL"]),
                salary="16-22 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Frontend Developer",
                company="Vercel",
                location="Remote",
                description="Optimize next-generation user experience libraries and React framework architectures.",
                skills=json.dumps(["JavaScript", "TypeScript", "React", "HTML", "CSS", "Next.js"]),
                salary="18-24 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="React UI Developer",
                company="Airbnb",
                location="Bangalore",
                description="Create highly interactive, accessible, and stunning user interface modules for holiday bookings.",
                skills=json.dumps(["JavaScript", "TypeScript", "React", "HTML", "CSS"]),
                salary="12-16 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Full Stack Developer",
                company="Stripe",
                location="Remote",
                description="Build and expand customer onboarding dashboards, payment widgets, and billing controls.",
                skills=json.dumps(["JavaScript", "TypeScript", "React", "Nodejs", "FastAPI", "SQL", "Docker"]),
                salary="22-28 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Full Stack Engineer",
                company="Razorpay",
                location="Mumbai",
                description="Implement merchants payment integrations, reporting portals, and checkout flows.",
                skills=json.dumps(["JavaScript", "React", "Nodejs", "SQL", "REST API", "Git"]),
                salary="14-18 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="DevOps Engineer",
                company="HashiCorp",
                location="Remote",
                description="Configure multi-cloud infrastructure deployments using Terraform, Vault, and Consul.",
                skills=json.dumps(["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Terraform"]),
                salary="20-25 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Site Reliability Engineer (SRE)",
                company="Slack",
                location="Remote",
                description="Optimize service availability, latency, performance, and monitoring systems.",
                skills=json.dumps(["Linux", "AWS", "Docker", "Kubernetes", "Monitoring", "Bash scripting"]),
                salary="18-24 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Cloud Engineer",
                company="AWS",
                location="Bangalore",
                description="Assist enterprise clients in migrating workloads and architecting scalable cloud setups.",
                skills=json.dumps(["AWS", "Terraform", "Cloud", "Docker", "Linux", "Kubernetes"]),
                salary="16-22 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Data Analyst",
                company="Uber",
                location="Hyderabad",
                description="Translate complex driver and passenger ride data patterns into actionable business metrics.",
                skills=json.dumps(["SQL", "Data Analysis", "Tableau", "Power BI", "Pandas", "Statistics"]),
                salary="10-14 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Product Data Analyst",
                company="Microsoft",
                location="Bangalore",
                description="Monitor telemetry indicators, design A/B testing frameworks, and present insights to product teams.",
                skills=json.dumps(["SQL", "Statistics", "Data Analysis", "Visualization", "Hypothesis testing"]),
                salary="14-18 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="NLP Engineer",
                company="Anthropic",
                location="Remote",
                description="Research alignment principles, context windows extensions, and semantic retrieval optimizations.",
                skills=json.dumps(["Python", "NLP", "BERT", "Transformers", "Hugging face", "RAG", "PyTorch"]),
                salary="26-34 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="NLP Software Engineer",
                company="Cohere",
                location="Remote",
                description="Build enterprise-grade semantic search APIs and multilingual text representations models.",
                skills=json.dumps(["Python", "NLP", "Transformers", "Language models", "RAG", "FastAPI"]),
                salary="22-28 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="AI Solutions Architect",
                company="IBM",
                location="Bangalore",
                description="Consult with global corporate customers to implement specialized AI integrations and ML models.",
                skills=json.dumps(["Python", "Machine Learning", "Deep Learning", "Cloud", "Docker"]),
                salary="24-30 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Machine Learning Intern",
                company="Adobe",
                location="Remote",
                description="Support core engineering squads in training computer vision and generative asset classifiers.",
                skills=json.dumps(["Python", "PyTorch", "TensorFlow", "Deep Learning", "Data preprocessing"]),
                salary="40-60k/month",
                job_type="Internship",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="Backend Developer (FastAPI)",
                company="CrowdStrike",
                location="Remote",
                description="Build scalable threat intelligence event ingestion microservices using async Python.",
                skills=json.dumps(["Python", "FastAPI", "PostgreSQL", "Docker", "Git", "REST API"]),
                salary="18-24 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            ),
            Job(
                title="React Frontend Engineer",
                company="Figma",
                location="Remote",
                description="Enhance browser performance, canvas render pipelines, and responsive vector tools.",
                skills=json.dumps(["JavaScript", "TypeScript", "React", "HTML", "CSS", "Git"]),
                salary="20-25 LPA",
                job_type="Full-time",
                source="Vedha Curated",
                url="#"
            )
        ]
        db.add_all(demo_jobs)
        db.commit()
        print(f"[SEED] Seeded {len(demo_jobs)} curated job listings successfully.")



def init_db() -> None:
    # Run simple ALTER command to add onboarding_complete column to users table if not exists
    from sqlalchemy import text
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN onboarding_complete BOOLEAN DEFAULT 0"))
            print("[MIGRATION] Added onboarding_complete column to users table.")
    except Exception:
        # Already exists or database doesn't support ALTER TABLE this way
        pass

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()