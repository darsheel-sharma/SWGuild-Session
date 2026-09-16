# AI Council — Architecture

## Overview

AI Council is a multi-agent debate system where four specialized AI agents independently analyze a question, a Critic debate round sharpens the analysis, and a Judge produces a final synthesized verdict.

## Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant R as Router
    participant CS as CouncilService
    participant DS as DebateService
    participant LLM as LLMService

    U->>R: POST /api/council/start { question }
    R->>CS: convene(question)

    CS->>DS: run_full_debate(question)

    par Round 1 — Parallel
        DS->>LLM: Analyst.run(question)
        DS->>LLM: Researcher.run(question)
        DS->>LLM: Critic.run(question)
        DS->>LLM: Alternative.run(question)
    end

    DS->>LLM: Critic.run(question, context=all_round1)

    CS->>LLM: Judge.judge(question, all_agents)

    CS->>R: CouncilResponse
    R->>U: JSON response
```

## Agent Responsibilities

| Agent       | Role                    | Key Behavior |
|-------------|-------------------------|--------------|
| Analyst     | Structured Analysis     | Breaks question into dimensions, identifies trade-offs |
| Researcher  | Context & Evidence      | Provides facts, examples, best practices |
| Critic      | Devil's Advocate        | Challenges assumptions, exposes weaknesses |
| Alternative | Alternative Perspectives| Explores unconventional angles |
| Judge       | Final Synthesis         | Weighs all inputs, produces actionable verdict |

## Layer Responsibilities

```
HTTP Request
    ↓
routers/council.py       ← validates input, calls service, handles HTTP errors
    ↓
services/council_service.py  ← top-level orchestration
    ↓
services/debate_service.py   ← manages agent rounds
    ↓
agents/*.py              ← individual agent behavior and system prompts
    ↓
services/llm_service.py  ← provider abstraction (OpenAI-compatible)
```

## Adding a New Agent

1. Create `backend/app/agents/myagent.py` inheriting `BaseAgent`
2. Set `name`, `role`, `system_prompt`
3. Add it to `DebateService.run_round_one()` in `debate_service.py`
4. It will automatically be included in the Judge's context
