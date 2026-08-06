# Backend Testing Guide - Phase 9

This guide outlines backend tests suite structures, configurations, and commands execution.

---

## 1. Test Architecture

Backend tests are segmented into:
- **Central AI Services (`tests/test_ai_services.py`):** Covers RAG and LLM mock outputs, text cleaning helpers, and chat memory managers.
- **Phase 9 Infrastructure (`tests/test_backend.py`):** Covers multi-language code compilation runs, sockets Presence managers, course catalog selections, and recruitment slot bookings.

---

## 2. Test Environments Configurations

- **Path Resolution (`pytest.ini`):** Sets `pythonpath = .` so the backend `app` module exports are resolved cleanly.
- **Async Frameworks (`pytest-asyncio`):** Configures `asyncio_mode = auto` to execute async test functions without errors.

---

## 3. Running Tests

To run the full suite:
```bash
.venv\Scripts\pytest -v
```

To run a specific test suite:
```bash
.venv\Scripts\pytest tests/test_backend.py -v
```

To generate a coverage report:
```bash
.venv\Scripts\pytest --cov=app tests/ -v
```
