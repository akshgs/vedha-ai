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
    if not target_role:
        return ROADMAP_DB["Full Stack Developer"]
    
    target_role_lower = target_role.lower()
    for role_name in ROADMAP_DB:
        if role_name.lower() in target_role_lower or target_role_lower in role_name.lower():
            return ROADMAP_DB[role_name]
            
    return ROADMAP_DB["Full Stack Developer"]