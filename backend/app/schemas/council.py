from pydantic import BaseModel, field_validator
from app.schemas.message import AgentResponse, DebateMessage, Verdict


class CouncilRequest(BaseModel):
    question: str

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Question cannot be empty.")
        if len(v) > 2000:
            raise ValueError("Question too long. Max 2000 characters.")
        return v


class CouncilResponse(BaseModel):
    question: str
    agents: list[AgentResponse]
    debate: list[DebateMessage]
    verdict: Verdict
