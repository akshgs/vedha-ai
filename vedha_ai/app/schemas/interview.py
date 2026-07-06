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