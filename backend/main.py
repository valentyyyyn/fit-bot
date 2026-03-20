import asyncio
import logging
import os
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from groq import Groq, APIError
from prompt import SYSTEM_PROMPT


logging.basicConfig(level = logging.INFO)
logger = logging.getLogger(__name__)


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length = 4, max_length = 1000)
    history: list[Message] = []

class ChatResponse(BaseModel):
    response: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.getenv("GROQ_API_KEY"):
        raise RuntimeError("GROQ_API_KEY environment variable is not set")
    yield


app = FastAPI(title = "FitBot API", version = "1.0.0", lifespan = lifespan)
client = Groq(api_key = os.getenv("GROQ_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health() -> dict[str, str]:
    return {"status": "OK"}


MAX_HISTORY = 20

@app.post("/api/v1/chat", response_model = ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    messages: list[dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in request.history[-MAX_HISTORY:]:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": request.message})

    try:
        completion = await asyncio.to_thread(
            client.chat.completions.create,
            model = "llama-3.3-70b-versatile",
            messages = messages,  # type: ignore[arg-type], Groq SDK expects List[ChatCompletionMessageParam] but we are passing List[Dict[str, str]]
        )
    except APIError as ERROR:
        logger.error("Groq API error: %s", ERROR)
        raise HTTPException(status_code = 503, detail = "External API error")

    content = completion.choices[0].message.content
    if content is None:
        content = ""

    return ChatResponse(response = content)