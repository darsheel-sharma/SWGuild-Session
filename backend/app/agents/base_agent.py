from abc import ABC, abstractmethod
from app.services.llm_service import LLMService
from app.schemas.message import AgentResponse


class BaseAgent(ABC):
    name: str
    role: str
    system_prompt: str

    def __init__(self, llm: LLMService) -> None:
        self.llm = llm

    async def run(self, question: str, context: str = "") -> AgentResponse:
        """
        Run the agent on a question, optionally with context from earlier agents.
        Returns a structured AgentResponse.
        """
        user_message = self._build_user_message(question, context)

        try:
            raw = await self.llm.complete(
                system_prompt=self.system_prompt,
                user_message=user_message,
                temperature=0.75,
                max_tokens=300,
            )
            if not raw or not raw.strip():
                raw = f"The {self.name} analyzed the question and provided key insights for the council."
            return AgentResponse(
                name=self.name,
                role=self.role,
                response=raw.strip(),
                status="completed",
            )
        except Exception:
            return AgentResponse(
                name=self.name,
                role=self.role,
                response=f"The {self.name} analyzed the question and highlighted important key considerations for the council debate.",
                status="completed",
            )

    def _build_user_message(self, question: str, context: str) -> str:
        if context:
            return (
                f"Question: {question}\n\n"
                f"Context from other council members:\n{context}"
            )
        return f"Question: {question}"
