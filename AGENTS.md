# AGENTS.md

## Project Overview
FitBot is a monorepo with a Python FastAPI backend and a frontend directory.

## Repository Structure
```
fit-bot/
├── backend/          # Python FastAPI application
│   ├── main.py      # FastAPI app entry point
│   ├── prompt.py    # System prompt for the chatbot
│   ├── requirements.txt
│   └── dockerfile
├── frontend/        # Frontend assets (HTML/JS)
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
```

### Frontend
The frontend is static HTML/JS. No build process required for development.
For production builds, use any static file server:
```bash
# Simple server
cd frontend && python -m http.server 3000

# With Node (if configured)
npm install
npm run dev
```

---

## Code Style Guidelines

### Python (Backend)

**Imports**
- Standard library imports first
- Third-party imports second (FastAPI, Pydantic, etc.)
- Local application imports last
- Use absolute imports when possible
- Alphabetize imports within each group

```python
# Correct order
import os
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from . import local_module
```

**Formatting**
- Use 4 spaces for indentation (no tabs)
- Maximum line length: 88 characters (Black default)
- Use trailing commas for multi-line structures
- One import per line

**Types**
- Use type hints for all function parameters and return values
- Use Pydantic models for request/response validation
- Prefer `Optional[X]` over `X | None`

```python
class Message(BaseModel):
    role: str
    content: str

@app.post("/chat")
def chat(request: ChatRequest) -> ChatResponse:
    ...
```

**Naming Conventions**
- `snake_case` for functions, variables, and methods
- `PascalCase` for classes and Pydantic models
- `SCREAMING_SNAKE_CASE` for constants
- Descriptive names: prefer `chat_request` over `req`

**Error Handling**
- Use FastAPI's built-in HTTP exceptions for API errors
- Return appropriate HTTP status codes
- Validate input with Pydantic models
- Never expose sensitive error details in production

```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```

**Async**
- Use `async def` for endpoints when performing I/O operations
- Use regular `def` for simple synchronous operations

---

### TypeScript/JavaScript (Frontend)

**Formatting**
- Use 2 spaces for indentation
- Maximum line length: 100 characters
- Use semicolons
- Single quotes for strings

**Types**
- Use TypeScript strict mode when available
- Explicit return types for functions
- Avoid `any` type

```typescript
interface Message {
  role: string;
  content: string;
}

function processMessage(msg: Message): string {
  return msg.content;
}
```

**Naming**
- `camelCase` for variables and functions
- `PascalCase` for classes and interfaces
- `kebab-case` for file names

---

### General Guidelines

**File Organization**
- One class per file for complex modules
- Group related functions together
- Keep files under 500 lines

**Comments**
- Use comments to explain "why", not "what"
- Keep comments up-to-date with code changes
- Document complex business logic

**Git Commits**
- Use conventional commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep commits atomic and focused

**Security**
- Never commit secrets, API keys, or credentials
- Use environment variables for configuration
- Validate and sanitize all user input
- Follow principle of least privilege

---

## Testing

**Current Status**: No tests are configured for this project.

When adding tests:

**Python**
```bash
# Install pytest
pip install pytest pytest-asyncio

# Run all tests
pytest

# Run specific test file
pytest tests/test_api.py

# Run specific test
pytest tests/test_api.py::test_chat_endpoint
```

**TypeScript/JavaScript**
```bash
# Run tests
npm test

# Run specific test
npm test -- --testPathPattern="chat.test.ts"

# Run in watch mode
npm test -- --watch
```

---

## Development Workflow

1. **Branches**: Create feature branches from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Pre-commit**: Run linting before committing
   ```bash
   # Python
   ruff check .
   black .

   # Frontend
   npm run lint
   ```

3. **Code Review**: Open a PR for review before merging

---

## Environment Variables

Backend requires:
```
# backend/.env (do not commit)
GROQ_API_KEY=your_api_key_here
```

Frontend may require:
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
- Tailwind CSS (configured but minimal usage)
- Vanilla JavaScript/TypeScript
