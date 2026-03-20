# AGENTS.md

## Project Overview
FitBot is a monorepo with a Python FastAPI backend and a frontend directory.

## Repository Structure
```
fit-bot/
├── backend/          # Python FastAPI application
│   ├── main.py       # FastAPI app entry point
│   ├── prompt.py     # System prompt for the chatbot
│   ├── requirements.txt
│   └── dockerfile
├── frontend/         # Frontend assets (TypeScript + HTML)
├── docker-compose.yml
└── .gitignore
```

---

## Build Commands

### Backend (Python)
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run the server
cd backend && uvicorn main:app --reload

# Run with Docker
docker-compose up --build

# Lint (configured in project)
ruff check backend/
```

### Frontend
```bash
# Install dependencies
cd frontend && npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Code Style Guidelines

### Python (Backend)

**Imports**: Standard library → Third-party → Local. Alphabetize within groups.
```python
import os
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from . import local_module
```

**Formatting**: 4 spaces, max 88 chars line length (Black), trailing commas.

**Types**: Use type hints for all parameters/returns. Use Pydantic models for validation. Prefer `Optional[X]` over `X | None`.

**Naming**: `snake_case` (functions/variables), `PascalCase` (classes/models), `SCREAMING_SNAKE_CASE` (constants).

**Error Handling**: Use FastAPI's HTTPException. Validate input with Pydantic. Never expose sensitive errors in production.

```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code = 404, detail = "Item not found")
    return {"item": items[item_id]}
```

**Async**: Use `async def` for I/O operations, regular `def` for sync operations.

---

### TypeScript/JavaScript (Frontend)

**Formatting**: 2 spaces, max 100 chars, semicolons, single quotes.

**Types**: Strict mode, explicit return types, avoid `any`.

**Naming**: `camelCase` (variables/functions), `PascalCase` (classes/interfaces), `kebab-case` (filenames).

---

### General Guidelines

**Security**: Never commit secrets/API keys. Use environment variables. Validate and sanitize all user input.

**Git Commits**: Use conventional format: `type(scope): description`. Types: feat, fix, docs, style, refactor, test, chore.

---

## Testing

**Current Status**: No tests configured.

When tests are added:
```bash
# Python (pytest)
pytest                 # all tests
pytest tests/test_api.py           # specific file
pytest tests/test_api.py::test_xyz # specific test

# JavaScript ( Vitest/Jest)
npm test
npm test -- --run
```

---

## Environment Variables

Required in `backend/.env` (do not commit):
```
GROQ_API_KEY=your_api_key_here
```

Optional frontend:
```
VITE_API_URL=http://localhost:8000
```

---

## Dependencies

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `groq` - LLM integration
- `python-dotenv` - Environment variables

### Frontend
- TypeScript
- Vite
- Tailwind CSS
