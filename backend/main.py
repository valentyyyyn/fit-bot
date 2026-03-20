from fastapi import FastAPI
from pydantic import BaseModel
from prompt import SYSTEM_PROMPT

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def root() -> dict[str, str]:
    return {"message": "FitBot API is running"}

@app.post("/chat", response_model = ChatResponse)
def chat(request: ChatRequest):
    return ChatResponse(response = "Hola, soy FitBot. ¿En qué puedo ayudarte? Te tiro la rela: ojala que en nada")