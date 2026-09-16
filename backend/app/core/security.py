from fastapi import Request, HTTPException
from app.core.config import get_settings

settings = get_settings()


def validate_question(question: str) -> str:
    """Basic input sanitization — trim whitespace and enforce length."""
    cleaned = question.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if len(cleaned) > settings.max_question_length:
        raise HTTPException(
            status_code=400,
            detail=f"Question too long. Max {settings.max_question_length} characters.",
        )
    return cleaned
