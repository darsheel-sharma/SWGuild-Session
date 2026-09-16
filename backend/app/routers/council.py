from fastapi import APIRouter, HTTPException
from app.schemas.council import CouncilRequest, CouncilResponse
from app.services.council_service import CouncilService

router = APIRouter(prefix="/council", tags=["council"])


@router.post("/start", response_model=CouncilResponse)
async def start_council(payload: CouncilRequest):
    """
    Convene the AI council on a question.

    Runs Analyst, Researcher, Critic, and Alternative in parallel,
    then a Critic debate round, then Judge synthesis.
    """
    try:
        service = CouncilService()
        result = await service.convene(payload.question)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        # Surface friendly LLM errors without internal details
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {exc}",
        )
