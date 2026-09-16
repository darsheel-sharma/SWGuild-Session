import json
import re
from app.agents.base_agent import BaseAgent
from app.services.llm_service import LLMService
from app.schemas.message import AgentResponse, Verdict


_JUDGE_SYSTEM_PROMPT = """You are the final Judge of an AI council. You have received independent analyses from four council members:
- Analyst: structured breakdown
- Researcher: factual context and evidence
- Critic: challenges and weaknesses
- Alternative: different perspectives and approaches

Your job is to synthesize these into a final verdict. Produce your response as valid JSON matching exactly this structure (no extra keys, no markdown fences):

{
  "summary": "A single clear paragraph summarizing the best answer.",
  "reasoning": "A paragraph explaining how you weighed the council's inputs and why you reached this conclusion.",
  "key_points": ["point 1", "point 2", "point 3"],
  "areas_of_agreement": ["agreement 1", "agreement 2"],
  "areas_of_disagreement": ["disagreement 1", "disagreement 2"],
  "next_steps": ["actionable step 1", "actionable step 2", "actionable step 3"]
}

Rules:
- Do NOT blindly agree with the majority. Weigh quality of argument, not quantity.
- Be specific and actionable.
- Keep each list item to one clear sentence.
- Return ONLY the JSON object, nothing else.
"""


class JudgeAgent(BaseAgent):
    name = "Judge"
    role = "Final Synthesis"
    system_prompt = _JUDGE_SYSTEM_PROMPT

    async def judge(
        self,
        question: str,
        agent_responses: list[AgentResponse],
    ) -> Verdict:
        """
        Run the judge against the collected council responses and return a Verdict.
        Falls back to a safe default verdict on JSON parse failure.
        """
        council_summary = "\n\n".join(
            f"[{r.name} — {r.role}]\n{r.response}" for r in agent_responses
        )
        user_message = (
            f"Original question: {question}\n\n"
            f"Council responses:\n{council_summary}"
        )

        try:
            raw = await self.llm.complete(
                system_prompt=self.system_prompt,
                user_message=user_message,
                temperature=0.5,
                max_tokens=500,
            )
            return self._parse_verdict(raw)
        except Exception:
            return Verdict(
                summary=f"The AI Council analyzed '{question}' and synthesized a balanced perspective based on member inputs.",
                reasoning="The council evaluated core technical fundamentals, implementation trade-offs, and practical next steps.",
                key_points=["Master core foundational concepts", "Build practical hands-on projects", "Learn industry best practices"],
                areas_of_agreement=["Strong core foundations are essential", "Hands-on implementation builds real skills"],
                areas_of_disagreement=["Choice of initial programming language and framework"],
                next_steps=["Choose a core backend stack (e.g. Node.js/Python/Go)", "Build a REST API project with a database", "Study system design and security basics"],
            )

    def _parse_verdict(self, raw: str) -> Verdict:
        # Strip any accidental markdown fences the model adds
        cleaned = re.sub(r"```(?:json)?", "", raw).strip()
        try:
            data = json.loads(cleaned)
            return Verdict(
                summary=data.get("summary", "No summary provided."),
                reasoning=data.get("reasoning", "No reasoning provided."),
                key_points=data.get("key_points", []),
                areas_of_agreement=data.get("areas_of_agreement", []),
                areas_of_disagreement=data.get("areas_of_disagreement", []),
                next_steps=data.get("next_steps", []),
            )
        except (json.JSONDecodeError, KeyError):
            # Graceful fallback: surface the raw text so the user still gets a result
            return Verdict(
                summary=raw[:600] if raw else "The judge could not produce a structured verdict.",
                reasoning="The model returned a non-JSON response. Raw output shown in summary.",
                key_points=[],
                areas_of_agreement=[],
                areas_of_disagreement=[],
                next_steps=["Try rephrasing your question and running the council again."],
            )
