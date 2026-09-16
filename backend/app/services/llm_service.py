"""
LLM service — thin provider abstraction over any OpenAI-compatible API.

Adding a new provider:
  1. Implement a class that inherits BaseLLMProvider.
  2. Override `chat_completion`.
  3. Register it in `_build_provider` or pass it to LLMService directly.
"""

import asyncio
import re
from abc import ABC, abstractmethod
from typing import Optional

import httpx

from app.core.config import get_settings


class BaseLLMProvider(ABC):
    @abstractmethod
    async def chat_completion(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        ...


class OpenAICompatibleProvider(BaseLLMProvider):
    """
    Works with OpenAI, Together AI, Groq, Ollama, or any service
    that speaks the /v1/chat/completions format.
    """

    def __init__(
        self,
        api_key: str,
        base_url: str,
        model: str,
        timeout: int = 60,
    ) -> None:
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout

    async def chat_completion(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                json=payload,
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()
            raw_content = data["choices"][0]["message"]["content"]
            # Strip <think>...</think> reasoning blocks if present
            cleaned = re.sub(r"<think>.*?</think>", "", raw_content, flags=re.DOTALL).strip()
            if not cleaned:
                cleaned = re.sub(r"</?think>", "", raw_content).strip()
            return cleaned


def _build_provider() -> BaseLLMProvider:
    settings = get_settings()
    return OpenAICompatibleProvider(
        api_key=settings.llm_api_key,
        base_url=settings.llm_base_url,
        model=settings.llm_model,
        timeout=settings.request_timeout,
    )


# Concurrency control to avoid blasting free tier rate limits
_LLM_SEMAPHORE = asyncio.Semaphore(4)


class LLMService:
    """Singleton-style service; share one provider across all agents."""

    def __init__(self, provider: Optional[BaseLLMProvider] = None) -> None:
        self._provider = provider or _build_provider()

    async def complete(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        max_retries = 1
        async with _LLM_SEMAPHORE:
            for attempt in range(max_retries):
                try:
                    return await self._provider.chat_completion(
                        system_prompt=system_prompt,
                        user_message=user_message,
                        temperature=temperature,
                        max_tokens=max_tokens,
                    )
                except httpx.TimeoutException:
                    if attempt == max_retries - 1:
                        raise RuntimeError(
                            "LLM request timed out. The model may be overloaded — try again."
                        )
                    await asyncio.sleep(2 * (attempt + 1))
                except httpx.HTTPStatusError as exc:
                    status = exc.response.status_code
                    err_msg = ""
                    try:
                        err_json = exc.response.json()
                        if isinstance(err_json, dict) and "error" in err_json:
                            err_sub = err_json["error"]
                            if isinstance(err_sub, dict):
                                err_msg = err_sub.get("message", "")
                            elif isinstance(err_sub, str):
                                err_msg = err_sub
                    except Exception:
                        err_msg = exc.response.text

                    if status == 401:
                        raise RuntimeError(
                            f"Invalid API key (HTTP 401). Check your LLM_API_KEY in backend/.env. {err_msg}"
                        )
                    if status == 429:
                        if "quota" in err_msg.lower() or "resource_exhausted" in err_msg.lower():
                            raise RuntimeError(
                                f"LLM API Quota Exceeded (HTTP 429). {err_msg}"
                            )
                        if attempt < max_retries - 1:
                            retry_after = exc.response.headers.get("Retry-After")
                            wait_time = None
                            if retry_after:
                                try:
                                    wait_time = float(retry_after)
                                except ValueError:
                                    pass
                            if not wait_time:
                                match = re.search(r"try again in ([\d\.]+)s", err_msg, re.IGNORECASE)
                                if match:
                                    wait_time = float(match.group(1)) + 0.5
                            if not wait_time:
                                wait_time = float(3 * (attempt + 1))
                            await asyncio.sleep(wait_time)
                            continue
                        raise RuntimeError(
                            f"Rate limit exceeded (HTTP 429). {err_msg or 'Wait a moment and try again.'}"
                        )
                    raise RuntimeError(f"LLM API error (HTTP {status}). {err_msg}")
                except Exception as exc:
                    if isinstance(exc, RuntimeError):
                        raise exc
                    if attempt == max_retries - 1:
                        raise RuntimeError(f"LLM call failed: {exc}") from exc
                    await asyncio.sleep(2 * (attempt + 1))

            raise RuntimeError("LLM call failed after maximum retries.")
