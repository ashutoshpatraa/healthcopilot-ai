from typing import Any
from fastapi import APIRouter, Depends
from models.user import User
from api.deps import get_current_active_user
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    # TODO: Implement RAG and LLM integration
    return ChatResponse(
        reply="Hello, I am HealthCopilot AI. How can I help you today?"
    )
