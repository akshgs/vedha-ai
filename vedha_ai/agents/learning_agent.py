class LearningAgent:

    def generate_roadmap(
        self,
        missing_skills
    ):

        roadmap = []

        for i, skill in enumerate(
            missing_skills,
            start=1
        ):
            roadmap.append(
                {
                    "step": i,
                    "skill": skill
                }
            )

        return roadmap