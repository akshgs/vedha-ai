import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.testclient import TestClient

import app.database.init_db
from app.services.compiler_service import CompilerService, CompilerUnavailableException
from app.api.v1.websocket import ConnectionManager
from app.repositories.course_repository import CourseRepository
from app.repositories.recruitment_repository import RecruitmentRepository
from app.security.jwt import get_current_user
from app.database.database import get_db

# Import FastAPI app to enable client testing
from main import app

# Create mock data objects for overrides
class MockUser:
    def __init__(self):
        self.id = 1
        self.name = "Test Student"
        self.email = "student@test.com"
        self.role = "student"
        self.status = "active"

shared_db_mock = MagicMock()

# ── Dependency Mock Overrides ──────────────────────────────────

def override_get_current_user():
    return MockUser()

def override_get_db():
    return shared_db_mock

# ── Compiler Tests ─────────────────────────────────────────────

def test_compiler_unsupported_language():
    res = CompilerService.execute_code("unsupported_lang", "print('hello')", [], "slug")
    assert res.status == "error"
    assert "Unsupported language" in res.output

def test_compiler_unavail_check():
    with patch("app.services.compiler_service.shutil.which", return_value=None):
        res = CompilerService.execute_code("javascript", "console.log('hi')", [], "two-sum")
        assert res.status == "error"
        assert "is not available on this server" in res.output

@pytest.mark.asyncio
async def test_compiler_python_execution_success():
    user_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        return [0, 1]
"""
    examples = [{"input": {"nums": [2, 7], "target": 9}, "output": [0, 1]}]
    res = CompilerService.execute_code("python", user_code, examples, "two-sum")
    assert res.status == "success"
    assert res.test_cases_passed == 1
    assert res.total_test_cases == 1

@pytest.mark.asyncio
async def test_compiler_python_execution_failure():
    user_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        return [9, 9]
"""
    examples = [{"input": {"nums": [2, 7], "target": 9}, "output": [0, 1]}]
    res = CompilerService.execute_code("python", user_code, examples, "two-sum")
    assert res.status == "error"
    assert res.test_cases_passed == 0

# ── WebSockets Tests ───────────────────────────────────────────

@pytest.mark.asyncio
async def test_websocket_connection_manager():
    manager = ConnectionManager()
    ws_mock = AsyncMock(spec=WebSocket)
    
    await manager.connect(ws_mock, "chat", "user-123")
    assert ws_mock in manager.active_connections["chat"]
    assert ws_mock in manager.user_sockets["user-123"]
    
    await manager.broadcast({"text": "hello"}, "chat")
    ws_mock.send_text.assert_called_once()
    
    await manager.disconnect(ws_mock, "chat", "user-123")
    assert ws_mock not in manager.active_connections["chat"]
    assert "user-123" not in manager.user_sockets

# ── Courses Repository Tests ───────────────────────────────────

def test_course_repository_empty_flow():
    db_mock = MagicMock()
    db_mock.query().filter().all.return_value = []
    
    repo = CourseRepository(db_mock)
    courses = repo.get_all_courses(1)
    assert len(courses) == 0

# ── Recruitment Repository Tests ───────────────────────────────

def test_recruitment_repository_applications_empty():
    db_mock = MagicMock()
    db_mock.query().filter().options().all.return_value = []
    
    repo = RecruitmentRepository(db_mock)
    apps = repo.get_sent_applications(1)
    assert len(apps) == 0

# ── API Route Client Integration Tests ─────────────────────────

@pytest.fixture
def client():
    # Setup dependency overrides for endpoints testing
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    # Tear down overrides
    app.dependency_overrides.clear()

def test_api_notification_post_read_alias(client):
    # Test POST /api/v1/notifications/{id}/read
    # Mocking NotificationRepository mark_as_read return value
    with patch("app.api.v1.notifications.NotificationRepository") as MockRepo:
        instance = MockRepo.return_value
        instance.mark_as_read.return_value = True
        
        response = client.post("/api/v1/notifications/1/read")
        assert response.status_code == 200
        assert response.json() == {"message": "Notification marked as read."}

def test_api_courses_catalog(client):
    # Test GET /api/v1/courses/
    with patch("app.api.v1.courses.CourseService.get_catalog") as MockGetCatalog:
        MockGetCatalog.return_value = [{"id": 1, "title": "React Guide", "progress": 0}]
        
        response = client.get("/api/v1/courses/")
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["title"] == "React Guide"

def test_api_courses_bookmark(client):
    # Test POST /api/v1/courses/{id}/bookmark
    with patch("app.api.v1.courses.CourseService.toggle_bookmark") as MockToggle:
        MockToggle.return_value = True
        
        response = client.post("/api/v1/courses/1/bookmark")
        assert response.status_code == 200
        assert response.json() == {"saved": True}

def test_api_recruitment_applications(client):
    # Test GET /api/v1/recruitment/applications
    with patch("app.api.v1.recruitment.RecruitmentService.get_applications") as MockGetApps:
        MockGetApps.return_value = [{"id": 1, "jobTitle": "Backend", "status": "Applied"}]
        
        response = client.get("/api/v1/recruitment/applications")
        assert response.status_code == 200
        assert response.json()[0]["jobTitle"] == "Backend"

def test_api_coding_stats(client):
    # Test GET /api/v1/coding/stats
    shared_db_mock.reset_mock()
    shared_db_mock.query.return_value.filter.return_value.count.return_value = 5
    shared_db_mock.query.return_value.filter.return_value.order_by.return_value.all.return_value = []
    
    response = client.get("/api/v1/coding/stats")
    assert response.status_code == 200
    assert "streak" in response.json()

def test_api_career_path(client):
    # Test POST /api/v1/ai/mentor/career-path with float probability values
    mock_response = {
        "predicted_roles": [
            {"role": "Lead Architect", "timeline": "3-5 years", "probability": 0.8, "required_skills": ["Design Patterns", "Cloud"]}
        ],
        "recommended_path": "Software Engineering Trajectory",
        "skill_investments": ["AWS", "Microservices"],
        "market_demand": "Very High",
        "growth_probability": 0.9,
        "industry_outlook": "Booming",
        "action_plan": ["Earn AWS Solutions Architect certification"],
        "status": "success"
    }
    with patch("app.api.v1.ai_mentor.predict_career_path") as mock_predict:
        mock_predict.return_value = mock_response
        
        response = client.post(
            "/api/v1/ai/mentor/career-path",
            json={
                "skills": ["Python", "FastAPI"],
                "experience_years": 2,
                "current_role": "Backend Engineer",
                "interests": ["Architecting systems"]
            }
        )
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["predicted_roles"][0]["probability"] == 0.8
        assert json_data["growth_probability"] == 0.9
        assert json_data["status"] == "success"

def test_api_interview_evaluate(client):
    # Test POST /api/v1/interview/evaluate success flow
    mock_eval = {
        "technical_score": 90,
        "communication_score": 85,
        "overall_score": 88,
        "strengths": ["Excellent response"],
        "weaknesses": ["None"],
        "suggestions": ["Keep up the good work"]
    }
    with patch("app.api.v1.interview.InterviewService.evaluate") as mock_eval_service:
        mock_eval_service.return_value = mock_eval
        
        response = client.post(
            "/api/v1/interview/evaluate",
            json={
                "interview_id": 1,
                "question": "What is Python?",
                "answer": "Python is a programming language.",
                "target_role": "Software Engineer"
            }
        )
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["technical_score"] == 90
        assert json_data["overall_score"] == 88
        assert json_data["strengths"] == ["Excellent response"]

def test_api_interview_evaluate_missing_role(client):
    # Test POST /api/v1/interview/evaluate with missing target_role returns HTTP 422
    response = client.post(
        "/api/v1/interview/evaluate",
        json={
            "interview_id": 1,
            "question": "What is Python?",
            "answer": "Python is a programming language."
        }
    )
    assert response.status_code == 422

def test_api_register_no_password_hash(client):
    # Test POST /register does not return password_hash or hashed_password
    mock_auth_response = {
        "access_token": "mocked_token",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "name": "Test User",
            "email": "register@test.com",
            "role": "student",
            "status": "active",
            "password_hash": "should_be_removed",
            "hashed_password": "should_be_removed"
        }
    }
    with patch("app.api.v1.auth.AuthService.register") as mock_register:
        mock_register.return_value = mock_auth_response
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "Test User",
                "email": "register@test.com",
                "password": "strongpassword123",
                "role": "student"
            }
        )
        assert response.status_code == 201
        json_data = response.json()
        assert "access_token" in json_data
        assert "password_hash" not in json_data["user"]
        assert "hashed_password" not in json_data["user"]
        assert json_data["user"]["email"] == "register@test.com"

def test_job_recommendation_filtering():
    # Test is_role_relevant filtering logic
    from app.services.job_service import is_role_relevant
    assert is_role_relevant("Machine Learning Engineer", "Junior Machine Learning Engineer") is True
    assert is_role_relevant("Machine Learning Engineer", "Frontend Developer") is False
    assert is_role_relevant("Machine Learning Engineer", "Data Scientist (AI/ML)") is True

def test_unique_skill_prevention(client):
    # Test POST /skill/create duplicate error handling (conflict HTTP 409)
    with patch("app.api.v1.skill_router.get_service") as mock_get_service:
        mock_svc = MagicMock()
        mock_svc.create.side_effect = ValueError("Skill already exists.")
        mock_get_service.return_value = mock_svc
        
        response = client.post(
            "/api/v1/skill/create",
            json={
                "skill_name": "Python",
                "category": "Programming",
                "proficiency_level": "Expert",
                "years_of_experience": 3.0,
                "is_primary": True
            }
        )
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]


