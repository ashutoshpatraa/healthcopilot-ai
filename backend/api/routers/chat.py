from typing import Any
from fastapi import APIRouter
from pydantic import BaseModel
from ml.chat_engine import chat_engine

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest) -> Any:
    response_text = chat_engine.respond(request.message)
    return ChatResponse(response=response_text)
