from pydantic import BaseModel
from typing import Optional


class AgentResponse(BaseModel):
    name: str
    role: str
    response: str
    status: str = "completed"


class DebateMessage(BaseModel):
    round: int
    agent: str
    content: str


class Verdict(BaseModel):
    summary: str
    reasoning: str
    key_points: list[str]
    areas_of_agreement: list[str]
    areas_of_disagreement: list[str]
    next_steps: list[str]
