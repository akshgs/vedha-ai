import json
from pathlib import Path


SKILL_FILE = (
    Path(__file__)
    .parent.parent
    / "data"
    / "skills.json"
)


def load_skills() -> set[str]:

    with open(
        SKILL_FILE,
        "r",
        encoding="utf-8",
    ) as f:

        data = json.load(f)

    skills = set()

    for values in data.values():
        skills.update(
            skill.lower()
            for skill in values
        )

    return skills