from modules.skill_gap import KERALA_COMPANIES


class JobAgent:

    def analyze(self, target_role):

        companies = KERALA_COMPANIES.get(
            target_role,
            []
        )

        jobs = []

        for company in companies:
            jobs.append({
                "company": company,
                "role": target_role
            })

        return jobs