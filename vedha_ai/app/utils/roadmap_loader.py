import json
from pathlib import Path


ROADMAP_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "roadmap_templates.json"
)


with open(
    ROADMAP_FILE,
    encoding="utf-8",
) as f:
    ROADMAP_DB = json.load(f)


def get_roadmap_template(
    target_role: str,
):
    return ROADMAP_DB.get(
        target_role,
        None,
    )