import json

class CareerTools:
    """Predefined helper tools for Agent tool-calling hooks."""
    
    @staticmethod
    def get_market_role_demands(job_title: str) -> str:
        """Looks up target skills and expectations for a role."""
        demands = {
            "backend engineer": ["Python", "FastAPI", "SQL", "Docker", "REST APIs"],
            "frontend developer": ["JavaScript", "TypeScript", "React", "CSS", "Vite"],
            "data scientist": ["Python", "Pandas", "PyTorch", "Scikit-Learn", "SQL"]
        }
        matched = demands.get(job_title.lower().strip(), ["Python", "SQL", "Software Engineering"])
        return f"Standard requirements for '{job_title}': {', '.join(matched)}."
