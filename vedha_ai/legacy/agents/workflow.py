from agents.resume_agent import ResumeAgent
from agents.career_agent import CareerAgent
from agents.learning_agent import LearningAgent
from agents.job_agent import JobAgent

class CareerWorkflow:

    def __init__(self):

        self.resume_agent = ResumeAgent()
        self.career_agent = CareerAgent()
        self.learning_agent = LearningAgent()
        self.job_agent = JobAgent()

    def run(self, resume_text, target_role):

        resume_result = self.resume_agent.analyze(
            resume_text,
            target_role
        )

        skills = resume_result["skills"]

        career_result = self.career_agent.analyze(
            skills,
            target_role
        )

        roadmap = self.learning_agent.generate_roadmap(
            career_result["missing_skills"]
        )

        jobs = self.job_agent.analyze(
            target_role
        )

        return {
            "resume": resume_result,
            "career": career_result,
            "roadmap": roadmap,
            "jobs": jobs
        }