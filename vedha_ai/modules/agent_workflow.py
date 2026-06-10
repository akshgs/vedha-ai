from fastapi import APIRouter
from pydantic import BaseModel

from agents.workflow import CareerWorkflow

router = APIRouter()

workflow = CareerWorkflow()

class WorkflowRequest(BaseModel):
    resume_text: str
    target_role: str

@router.post("/career-analysis")
def career_analysis(data: WorkflowRequest):

    result = workflow.run(
        data.resume_text,
        data.target_role
    )

    return result