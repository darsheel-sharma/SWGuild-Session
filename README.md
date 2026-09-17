# AI Council

> Multiple perspectives. One synthesized answer.

AI Council is a multi-agent debate system. You ask a question, four specialized AI agents analyze it independently, a Critic sharpens the debate, and a Judge produces a balanced synthesis.

---

## Features

- **4 specialized agents** — Analyst, Researcher, Critic, Alternative
- **Structured debate** — Critic reviews all responses before the Judge decides
- **Provider-agnostic LLM** — works with OpenAI, Together AI, Groq, Ollama, or any OpenAI-compatible API
- **Dark-first UI** — clean, minimal, responsive
- **FastAPI backend** — async, typed, layered architecture

---

## Architecture

```
User question
      ↓
  FastAPI Router
      ↓
  CouncilService
      ↓
  DebateService
    ├── Analyst    ─┐
    ├── Researcher  ├── Round 1 (parallel)
    ├── Critic      │
    └── Alternative ┘
      ↓
  Critic (Round 2 — reviews all responses)
      ↓
  JudgeAgent
      ↓
  Final Verdict
```

See [`docs/architecture.md`](docs/architecture.md) for the full Mermaid diagram.

---

## Folder Structure

```
ai-council/
├── frontend/
│   └── src/
│       ├── components/   # UI components
│       ├── pages/        # Home, Council
│       ├── services/     # api.js — all fetch calls
│       ├── hooks/        # useCouncil.js
│       └── App.jsx
│
├── backend/
│   └── app/
│       ├── routers/      # HTTP layer
│       ├── services/     # Orchestration
│       ├── agents/       # Agent definitions
│       ├── schemas/      # Pydantic models
│       └── core/         # Config, security
│
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable       | Description                        | Default                       |
|----------------|------------------------------------|-------------------------------|
| `LLM_API_KEY`  | Your LLM provider API key          | *(required)*                  |
| `LLM_BASE_URL` | OpenAI-compatible base URL         | `https://api.openai.com/v1`   |
| `LLM_MODEL`    | Model name                         | `gpt-4o-mini`                 |

Works with **any OpenAI-compatible LLM provider**:

| Provider | `LLM_BASE_URL` | Recommended `LLM_MODEL` |
|---|---|---|
| **Groq (Free & Fast)** | `https://api.groq.com/openai/v1` | `qwen/qwen3.8-27b` or `llama-3.3-70b-versatile` |
| **OpenAI** | `https://api.openai.com/v1` | `gpt-4o-mini` or `gpt-4o` |
| **Google Gemini** | `https://generativelanguage.googleapis.com/v1beta/openai` | `gemini-2.0-flash` |
| **Together AI** | `https://api.together.xyz/v1` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| **Ollama (Local)** | `http://localhost:11434/v1` | `llama3.2` or `mistral` |

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your API key

python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

---

## API Endpoints

| Method | Path               | Description          |
|--------|--------------------|----------------------|
| POST   | `/api/council/start` | Run the council     |
| GET    | `/api/agents/`     | List agent metadata  |
| GET    | `/api/health`      | Health check         |

### POST /api/council/start

**Request:**
```json
{ "question": "Should I learn DSA before competitive programming?" }
```

**Response:**
```json
{
  "question": "...",
  "agents": [
    { "name": "Analyst", "role": "...", "response": "...", "status": "completed" }
  ],
  "debate": [
    { "round": 2, "agent": "Critic", "content": "..." }
  ],
  "verdict": {
    "summary": "...",
    "reasoning": "...",
    "key_points": [],
    "areas_of_agreement": [],
    "areas_of_disagreement": [],
    "next_steps": []
  }
}
```

---

## How to Add a New Agent

1. Create `backend/app/agents/myagent.py`:

```python
from app.agents.base_agent import BaseAgent

class MyAgent(BaseAgent):
    name = "MyAgent"
    role = "My Role"
    system_prompt = "You are..."
```

2. Import and add it to `DebateService.run_round_one()` in `debate_service.py`:

```python
results = await asyncio.gather(
    self.analyst.run(question),
    self.researcher.run(question),
    self.critic.run(question),
    self.alternative.run(question),
    self.myagent.run(question),   # ← add here
)
```

3. Done. The Judge will automatically receive the new agent's response as context.

---

## Error Handling

| Error                  | Response                              |
|------------------------|---------------------------------------|
| Missing API key        | 400 — clear message, no stack trace   |
| Empty question         | 400 — validation error                |
| LLM timeout            | 502 — user-friendly message           |
| Rate limit             | 502 — retry suggestion                |
| Invalid API key        | 502 — check your LLM_API_KEY          |
| Unexpected error       | 500 — generic safe message            |

API keys and stack traces are never exposed to the frontend.
