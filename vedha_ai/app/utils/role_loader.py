import json
from pathlib import Path

ROLE_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "role_weights.json"
)


def load_role_weights():

    with open(
        ROLE_FILE,
        "r",
        encoding="utf-8",
    ) as f:

        return json.load(f)