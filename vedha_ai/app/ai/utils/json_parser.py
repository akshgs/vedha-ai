"""
app/ai/utils/json_parser.py
Robust JSON extraction from LLM outputs (handles markdown fences, partial output).
Reusable across all AI services.
"""
import json
import re
from typing import Any


def extract_json(text: str) -> dict | list:
    """
    Robustly extract JSON from LLM output.
    Handles: raw JSON, ```json ... ```, ``` ... ```, mixed prose.
    """
    # Strip whitespace
    text = text.strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from ```json ... ``` fence
    json_fence_match = re.search(
        r"```json\s*([\s\S]*?)\s*```",
        text,
        re.IGNORECASE,
    )
    if json_fence_match:
        try:
            return json.loads(json_fence_match.group(1))
        except json.JSONDecodeError:
            pass

    # Try extracting from ``` ... ``` fence
    code_fence_match = re.search(
        r"```\s*([\s\S]*?)\s*```",
        text,
    )
    if code_fence_match:
        try:
            return json.loads(code_fence_match.group(1))
        except json.JSONDecodeError:
            pass

    # Try finding the largest JSON object or array
    # by scanning for { ... } or [ ... ]
    for pattern in [r"\{[\s\S]*\}", r"\[[\s\S]*\]"]:
        matches = re.findall(pattern, text)
        for match in sorted(matches, key=len, reverse=True):
            try:
                return json.loads(match)
            except json.JSONDecodeError:
                continue

    raise ValueError(f"Could not extract valid JSON from LLM output: {text[:200]}")


def safe_extract_json(text: str, fallback: Any = None) -> Any:
    """
    Like extract_json but returns fallback on failure instead of raising.
    """
    try:
        return extract_json(text)
    except (ValueError, Exception):
        return fallback


def merge_json_fields(base: dict, override: dict) -> dict:
    """Shallow merge two dicts, override takes priority."""
    return {**base, **override}
