from fastapi import APIRouter

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("/")
async def list_agents():
    """Returns metadata about all available council agents."""
    return {
        "agents": [
            {
                "name": "Analyst",
                "role": "Structured Analysis",
                "description": "Breaks questions into key dimensions, identifies trade-offs and hidden assumptions.",
            },
            {
                "name": "Researcher",
                "role": "Context & Evidence",
                "description": "Provides factual context, real-world examples, and relevant background.",
            },
            {
                "name": "Critic",
                "role": "Devil's Advocate",
                "description": "Challenges assumptions, exposes weaknesses, and calls out oversimplifications.",
            },
            {
                "name": "Alternative",
                "role": "Alternative Perspectives",
                "description": "Explores unconventional angles, reframes the question, and surfaces minority views.",
            },
            {
                "name": "Judge",
                "role": "Final Synthesis",
                "description": "Reads all responses and produces a balanced, actionable synthesis.",
            },
        ]
    }
