class AIWorkflowOrchestrator:
    """Orchestrates multi-step AI pipelines (e.g. ATS + skill gap analyses)."""
    
    @staticmethod
    async def run_resume_screening_workflow(ats_service, skill_gap_service, resume_text, target_skills):
        """Runs sequential resume evaluation and returns consolidated metrics."""
        # Step 1: Execute detailed ATS matching
        ats_evaluation = await ats_service(resume_text, target_skills)
        
        # Step 2: Feed outcomes to isolate critical skill gaps
        gaps_evaluation = await skill_gap_service(resume_text, target_skills)
        
        return {
            "ats_score": ats_evaluation.get("score", 70),
            "matched_skills": ats_evaluation.get("matched_skills", []),
            "missing_skills": gaps_evaluation.get("missing_skills", []),
            "recommendations": gaps_evaluation.get("recommendations", [])
        }
