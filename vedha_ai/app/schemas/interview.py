from datetime import datetime

from pydantic import BaseModel, Field


class InterviewGenerateRequest(BaseModel):
    student_id: int = Field(gt=0)
    target_role: str = Field(min_length=2, max_length=100)


class BaseQuestions(BaseModel):
    technical: list[str]
    hr: list[str]


class AIQuestions(BaseModel):
    technical: list[str]
    follow_up: list[str]
    scenario: list[str]


class InterviewGenerateResponse(BaseModel):
    interview_id: int
    base_questions: BaseQuestions
    ai_questions: AIQuestions


class InterviewEvaluateRequest(BaseModel):
    interview_id: int = Field(gt=0)
    question: str = Field(min_length=2)
    answer: str = Field(min_length=2)
    target_role: str = Field(min_length=2, max_length=100)


class InterviewEvaluateResponse(BaseModel):
    technical_score: int
    communication_score: int
    overall_score: int
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]


class InterviewHistoryItem(BaseModel):
    interview_id: int
    target_role: str
    status: str
    overall_score: float | None = None
    created_at: datetime
    completed_at: datetime | None = None


class InterviewHistoryResponse(BaseModel):
    history: list[InterviewHistoryItem]


class InterviewAnswerItem(BaseModel):
    question: str
    answer: str
    technical_score: int
    communication_score: int
    overall_score: int
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]


class InterviewDetailsResponse(BaseModel):
    interview_id: int
    target_role: str
    status: str
    overall_score: float | None = None
    created_at: datetime
    completed_at: datetime | None = None
    answers: list[InterviewAnswerItem]


class InterviewCompleteRequest(BaseModel):
    interview_id: int = Field(gt=0)


class InterviewCompleteResponse(BaseModel):
    interview_id: int
    status: str
    overall_score: float
    message: str


class InterviewReportResponse(BaseModel):
    overall_assessment: str
    technical_level: str
    communication_level: str
    strengths: list[str]
    weaknesses: list[str]
    recommended_topics: list[str]
    recommended_projects: list[str]
    job_readiness: str
    next_learning_plan: str
    hiring_recommendation: str