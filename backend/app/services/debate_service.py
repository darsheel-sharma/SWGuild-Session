"""
Debate service — manages the inter-agent debate rounds.

Round 1: All agents independently answer the question.
Round 2: Critic reviews the collected responses and sharpens its critique.
Round 3: Judge synthesizes everything.

The architecture is intentionally extensible: add more rounds by appending
to the debate list before the judge step.
"""

import asyncio
from app.schemas.message import AgentResponse, DebateMessage
from app.agents.analyst import AnalystAgent
from app.agents.researcher import ResearcherAgent
from app.agents.critic import CriticAgent
from app.agents.alternative import AlternativeAgent
from app.services.llm_service import LLMService


class DebateService:
    def __init__(self, llm: LLMService) -> None:
        self.llm = llm
        self.analyst = AnalystAgent(llm)
        self.researcher = ResearcherAgent(llm)
        self.critic = CriticAgent(llm)
        self.alternative = AlternativeAgent(llm)

    async def run_round_one(self, question: str) -> list[AgentResponse]:
        """All four agents answer independently in parallel."""
        results = await asyncio.gather(
            self.analyst.run(question),
            self.researcher.run(question),
            self.critic.run(question),
            self.alternative.run(question),
        )
        return list(results)

    async def run_round_two(
        self,
        question: str,
        round_one: list[AgentResponse],
    ) -> tuple[list[AgentResponse], list[DebateMessage]]:
        """
        Critic re-evaluates after seeing all round-one responses.
        Returns updated agent list + debate log.
        """
        debate_log: list[DebateMessage] = []

        # Build context string for critic
        context = "\n\n".join(
            f"{r.name}: {r.response}" for r in round_one
        )

        critic_rebuttal = await self.critic.run(question, context=context)

        # Record the debate exchange
        debate_log.append(
            DebateMessage(
                round=2,
                agent=self.critic.name,
                content=critic_rebuttal.response,
            )
        )

        # Merge: replace the original critic response with the sharpened one
        updated = [r if r.name != "Critic" else critic_rebuttal for r in round_one]
        return updated, debate_log

    async def run_full_debate(
        self, question: str
    ) -> tuple[list[AgentResponse], list[DebateMessage]]:
        round_one = await self.run_round_one(question)
        final_agents, debate = await self.run_round_two(question, round_one)
        return final_agents, debate
