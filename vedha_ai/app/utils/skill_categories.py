import json
from pathlib import Path

SKILL_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "skills.json"
)

with open(SKILL_FILE, encoding="utf-8") as f:
    SKILL_DB = json.load(f)


def get_skill_category(skill: str):

    skill = skill.lower()

    for category, skills in SKILL_DB.items():

        if skill in [s.lower() for s in skills]:
            return category

    return None