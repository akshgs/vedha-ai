#!/usr/bin/env python
"""
Standalone Database Seeder CLI for Vedha AI.
Usage:
    python seed.py
"""
import sys
import time

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from app.database.init_db import run_seed

if __name__ == "__main__":
    t0 = time.perf_counter()
    print("[SEEDER] Starting Vedha AI Standalone Database Seeder...")
    try:
        run_seed()
        elapsed = time.perf_counter() - t0
        print(f"[SEEDER] Seeding completed in {elapsed:.2f} seconds.")
    except Exception as e:
        print(f"[SEEDER ERROR] Seeding failed: {e}", file=sys.stderr)
        sys.exit(1)
