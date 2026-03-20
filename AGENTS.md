# AGENTS.md

## Project Overview
FitBot is a chatbot web app for a fictional gym (FitCore). Monorepo with a Python FastAPI backend and a TypeScript/Vite frontend.

## Repository Structure
```
fit-bot/
├── backend/
│   ├── main.py           # FastAPI app, chat endpoint, health check
│   ├── prompt.py         # System prompt constant (SYSTEM_PROMPT)
│   ├── requirements.txt
│   └── dockerfile
├── frontend/
│   ├── index.html        # SPA entry point
│   ├── src/
│   │   ├── main.ts       # DOM manipulation, chat logic, API calls
│   │   └── global.css    # Tailwind v4 + custom animations
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── dockerfile
├── docker-compose.yml
└── DOCS.md               # Project documentation (Spanish)
```

---

## Build / Run Commands

### Backend (Python)
```bash
pip install -r backend/requirements.txt
cd backend && uvicorn main:app --reload       # dev server on :8000
ruff check backend/                            # lint
```

### Frontend (bun — not npm)
```bash
cd frontend && bun install
bun run dev                                    # dev server on :5173 (Vite default)
bun run build                                  # typecheck + production build
bun run preview                                # preview production build
```

### Docker
```bash
docker-compose up --build                      # runs both backend (:8000) and frontend (:3000)
```

---

## Testing

No tests configured yet. When added:
```bash
# Python
pytest
pytest tests/test_api.py
pytest tests/test_api.py::test_xyz

# JS/TS
bun test
```

---

## Code Style — Python (Backend)

**Imports**: stdlib → third-party → local, alphabetized within groups.
```python
import asyncio
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from groq import Groq, APIError
from pydantic import BaseModel, Field

from prompt import SYSTEM_PROMPT
```

**Formatting**: 4 spaces, no enforced line-length limit in config (keep reasonable ~100).

**Types**: type hints on all params/returns. Pydantic `BaseModel` for request/response schemas. Use `list[X]` (lowercase) not `List[X]`.

**Naming**: `snake_case` functions/vars, `PascalCase` classes/models, `SCREAMING_SNAKE_CASE` constants.

**Error handling**: raise `HTTPException` with appropriate status codes. Catch specific exceptions (`APIError`), log with `logging` module, never expose internal details.

**Async**: `async def` for I/O-bound endpoints; use `asyncio.to_thread()` for sync SDK calls (see `main.py:61`).

**Pydantic validation**: use `Field(...)` for constraints (min/max length, etc).

---

## Code Style — TypeScript (Frontend)

**Formatting**: 4 spaces (match existing code), semicolons, single quotes.

**Types**: strict mode enabled in tsconfig. Use explicit return types on functions (`: void`, `: Promise<void>`). Use `as` for DOM assertions. Avoid `any`.

**Naming**: `camelCase` vars/functions, `PascalCase` interfaces/types, `SCREAMING_SNAKE_CASE` top-level constants. Files are `kebab-case`.

**DOM pattern**: vanilla DOM manipulation (`document.createElement`, `classList`, `addEventListener`). No framework. Build HTML strings with template literals for initial render.

**Imports**: CSS imported at top of entry file (`import './global.css'`). Environment vars via `import.meta.env`.

---

## General Guidelines

**Security**: never commit `.env` files. API keys via environment variables only. Validate all user input (Pydantic on backend).

**Git commits**: conventional format — `type(scope): description`. Types: feat, fix, docs, style, refactor, test, chore.

**API conventions**: endpoints under `/api/v1/` prefix. Health check at `GET /api/v1/health`. Chat at `POST /api/v1/chat`.

---

## Environment Variables

`backend/.env` (git-ignored):
```
GROQ_API_KEY=your_api_key_here
```

Frontend (optional):
```
VITE_API_URL=http://localhost:8000
```

---

## Key Dependencies

### Backend
- `fastapi` + `uvicorn` — web framework + ASGI server
- `groq` — LLM API client (llama-3.3-70b-versatile)
- `python-dotenv` — env loading

### Frontend
- `vite` — bundler + dev server
- `tailwindcss` v4 — utility CSS
- `typescript` ~5.9
- `bun` — package manager + runtime
