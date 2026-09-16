"""
Council service — top-level orchestration.

Wires together:
  DebateService  → manages agent rounds
  JudgeAgent     → produces final verdict
  CouncilResponse → assembled result returned to the router
"""

from app.services.llm_service import LLMService
from app.services.debate_service import DebateService
from app.agents.judge import JudgeAgent
from app.schemas.council import CouncilResponse
from app.core.config import get_settings

settings = get_settings()


class CouncilService:
    def __init__(self) -> None:
        settings.validate_llm_config()
        self.llm = LLMService()
        self.debate_service = DebateService(self.llm)
        self.judge = JudgeAgent(self.llm)

    async def convene(self, question: str) -> CouncilResponse:
        # 1. Run all debate rounds
        agents, debate = await self.debate_service.run_full_debate(question)

        # 2. Judge synthesizes everything
        verdict = await self.judge.judge(question, agents)

        return CouncilResponse(
            question=question,
            agents=agents,
            debate=debate,
            verdict=verdict,
        )
