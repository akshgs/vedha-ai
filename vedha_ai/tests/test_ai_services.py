"""
tests/test_ai_services.py
Unit and integration tests for all centralized AI services.
Tests use mocking — no real LLM/API calls.
Run with: pytest tests/test_ai_services.py -v
"""
import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

import app.ai.services.coding_ai_service
import app.ai.services.resume_ai_service
import app.ai.services.career_ai_service


# ── Utils ──────────────────────────────────────────────────────

class TestJSONParser:

    def test_parses_raw_json(self):
        from app.ai.utils.json_parser import extract_json
        result = extract_json('{"key": "value"}')
        assert result == {"key": "value"}

    def test_parses_json_fence(self):
        from app.ai.utils.json_parser import extract_json
        result = extract_json('```json\n{"key": "value"}\n```')
        assert result == {"key": "value"}

    def test_parses_code_fence(self):
        from app.ai.utils.json_parser import extract_json
        result = extract_json('```\n{"key": "value"}\n```')
        assert result == {"key": "value"}

    def test_raises_on_invalid(self):
        from app.ai.utils.json_parser import extract_json
        with pytest.raises(ValueError):
            extract_json("not json at all")

    def test_safe_extract_returns_fallback(self):
        from app.ai.utils.json_parser import safe_extract_json
        result = safe_extract_json("garbage", fallback={"error": True})
        assert result == {"error": True}


class TestTextCleaner:

    def test_normalize_text(self):
        from app.ai.utils.text_cleaner import normalize_text
        result = normalize_text("  hello   world  ")
        assert result == "hello world"

    def test_truncate_text(self):
        from app.ai.utils.text_cleaner import truncate_text
        text = "a " * 5000  # 10000 chars
        result = truncate_text(text, max_chars=100)
        assert len(result) <= 100

    def test_split_into_chunks(self):
        from app.ai.utils.text_cleaner import split_into_chunks
        text = "Hello world. " * 100
        chunks = split_into_chunks(text, chunk_size=100)
        assert len(chunks) > 1
        for chunk in chunks:
            assert len(chunk) > 0

    def test_clean_resume_text(self):
        from app.ai.utils.text_cleaner import clean_resume_text
        text = "John Doe\n\nPage 1 of 2\n\n------\n\nSkills: Python"
        result = clean_resume_text(text)
        assert "Page 1 of 2" not in result
        assert "Python" in result


# ── Session Memory ─────────────────────────────────────────────

class TestSessionMemory:

    def setup_method(self):
        from app.ai.memory.session_memory import SessionMemory
        self.memory = SessionMemory(max_turns=3, ttl_seconds=60)

    def test_add_and_get_message(self):
        self.memory.add_message(1, "user", "Hello", "career")
        history = self.memory.get_history(1, "career")
        assert len(history) == 1
        assert history[0].role == "user"
        assert history[0].content == "Hello"

    def test_max_turns_enforcement(self):
        for i in range(10):
            self.memory.add_message(1, "user", f"msg {i}", "career")
            self.memory.add_message(1, "assistant", f"reply {i}", "career")
        history = self.memory.get_history(1, "career")
        assert len(history) <= 6  # max_turns * 2

    def test_clear_session(self):
        self.memory.add_message(2, "user", "Hi", "career")
        self.memory.clear_session(2, "career")
        assert not self.memory.session_exists(2, "career")

    def test_format_history_string(self):
        self.memory.add_message(3, "user", "Hello", "career")
        self.memory.add_message(3, "assistant", "Hi!", "career")
        text = self.memory.format_history_string(3, "career")
        assert "User:" in text
        assert "Vedha AI:" in text


# ── AI Services (mocked) ───────────────────────────────────────

class TestCodingAIService:

    @pytest.mark.asyncio
    async def test_explain_code_success(self):
        mock_reply = "This code implements bubble sort..."

        with patch("app.ai.services.coding_ai_service._explain_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value=mock_reply)
            from app.ai.services.coding_ai_service import explain_code
            result = await explain_code("def sort(arr): pass", "python")
            assert result["status"] == "success"
            assert "explanation" in result

    @pytest.mark.asyncio
    async def test_analyze_complexity_success(self):
        mock_output = '{"time_complexity": "O(n)", "space_complexity": "O(1)", "reasoning": "linear"}'

        with patch("app.ai.services.coding_ai_service._big_o_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value=mock_output)
            from app.ai.services.coding_ai_service import analyze_complexity
            result = await analyze_complexity("for i in range(n): pass", "python")
            assert result["status"] == "success"

    @pytest.mark.asyncio
    async def test_explain_code_fallback_on_error(self):
        with patch("app.ai.services.coding_ai_service._explain_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(side_effect=Exception("LLM error"))
            from app.ai.services.coding_ai_service import explain_code
            result = await explain_code("code", "python")
            assert result["status"] == "error"
            assert "explanation" in result


class TestResumeAIService:

    @pytest.mark.asyncio
    async def test_build_resume_fallback(self):
        with patch("app.ai.services.resume_ai_service._builder_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(side_effect=Exception("LLM unavailable"))
            from app.ai.services.resume_ai_service import build_resume
            result = await build_resume(
                target_role="ML Engineer",
                experience="2 years at XYZ",
                education="B.Tech CS",
                skills=["Python", "PyTorch"],
                projects=["Built classifier"],
            )
            assert result["status"] == "fallback"
            assert "skills_section" in result

    @pytest.mark.asyncio
    async def test_analyze_skill_gap_success(self):
        mock_output = json.dumps({
            "gap_score": 5,
            "critical_missing": ["Docker", "K8s"],
            "nice_to_have": ["Terraform"],
            "learning_plan": [],
            "total_weeks_to_ready": 12,
            "summary": "You need 3 more skills.",
        })
        with patch("app.ai.services.resume_ai_service._skill_gap_chain") as mock_chain, \
             patch("app.ai.services.resume_ai_service.retrieve_context", return_value="context"):
            mock_chain.ainvoke = AsyncMock(return_value=mock_output)
            from app.ai.services.resume_ai_service import analyze_skill_gap
            result = await analyze_skill_gap(
                target_role="DevOps Engineer",
                current_skills=["Docker"],
                matched_skills=["Docker"],
                missing_skills=["K8s", "Terraform"],
            )
            assert result["status"] == "success"


class TestCareerAIService:

    @pytest.mark.asyncio
    async def test_chat_with_career_mentor_success(self):
        with patch("app.ai.services.career_ai_service._mentor_chain") as mock_chain, \
             patch("app.ai.services.career_ai_service.retrieve_context", return_value="ctx"), \
             patch("app.ai.services.career_ai_service.session_memory") as mock_mem:
            mock_chain.ainvoke = AsyncMock(return_value="Here's my advice...")
            mock_mem.format_history_string.return_value = "No previous conversation."
            mock_mem.add_message = MagicMock()
            from app.ai.services.career_ai_service import chat_with_career_mentor
            result = await chat_with_career_mentor(
                user_id=1,
                message="How do I become an ML engineer?",
                target_role="ML Engineer",
            )
            assert result["status"] == "success"
            assert "reply" in result

    @pytest.mark.asyncio
    async def test_predict_salary_fallback(self):
        with patch("app.ai.services.career_ai_service._salary_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(side_effect=Exception("error"))
            from app.ai.services.career_ai_service import predict_salary
            result = await predict_salary("ML Engineer", ["Python"], 2, "Bangalore")
            assert result["status"] == "fallback"
            assert "predicted_lpa" in result

    @pytest.mark.asyncio
    async def test_predict_career_path_fallback(self):
        with patch("app.ai.services.career_ai_service._career_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(side_effect=Exception("error"))
            from app.ai.services.career_ai_service import predict_career_path
            result = await predict_career_path(["Python"], 2, "Student")
            assert result["status"] == "fallback"
            assert result["predicted_roles"][0]["probability"] == 0.85
            assert result["growth_probability"] == 0.80


# ── Notification Repository ────────────────────────────────────

class TestNotificationRepository:

    def test_create_and_count(self):
        from unittest.mock import MagicMock
        from app.repositories.notification_repository import NotificationRepository

        db = MagicMock()
        repo = NotificationRepository(db)

        mock_notif = MagicMock()
        mock_notif.id = 1
        db.add = MagicMock()
        db.commit = MagicMock()
        db.refresh = MagicMock()

        # We just verify no exceptions are raised
        # Full DB tests require a test DB fixture
        assert repo is not None


# ── Problem Repository ─────────────────────────────────────────

class TestProblemRepository:

    def test_repository_instantiation(self):
        from unittest.mock import MagicMock
        from app.repositories.problem_repository import ProblemRepository, SubmissionRepository

        db = MagicMock()
        prob_repo = ProblemRepository(db)
        sub_repo = SubmissionRepository(db)

        assert prob_repo is not None
        assert sub_repo is not None


# ── Interview Evaluator ────────────────────────────────────────

class TestInterviewEvaluator:

    @pytest.mark.asyncio
    async def test_evaluate_answer_success(self):
        mock_output = json.dumps({
            "technical_score": 85,
            "communication_score": 90,
            "overall_score": 88,
            "strengths": ["Clear response", "Accurate syntax"],
            "weaknesses": ["Minor delay"],
            "suggestions": ["Practice more scenarios"]
        })
        with patch("app.ai.interview_evaluator.evaluation_chain") as mock_chain, \
             patch("app.ai.interview_evaluator.retrieve_context", return_value="context"):
            mock_chain.invoke = MagicMock(return_value=mock_output)
            from app.ai.interview_evaluator import evaluate_answer
            result = evaluate_answer(
                question="What is FastAPI?",
                answer="FastAPI is a modern web framework for building APIs with Python.",
                target_role="Backend Developer"
            )
            assert result["technical_score"] == 85
            assert result["overall_score"] == 88
            assert "suggestions" in result

