import json
from pathlib import Path


QUESTION_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "interview_questions.json"
)


with open(
    QUESTION_FILE,
    encoding="utf-8",
) as f:
    QUESTION_DB = json.load(f)


def generate_questions(
    target_role: str,
):

    role_data = QUESTION_DB.get(
        target_role
    )

    if not role_data:
        return {
            "technical": [],
            "hr": [],
        }

    return {
        "technical": role_data.get(
            "technical",
            [],
        ),
        "hr": role_data.get(
            "hr",
            [],
        ),
    }