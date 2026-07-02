from typing import Any
from fastapi import APIRouter
from pydantic import BaseModel
from ml.chat_engine import chat_engine

router = APIRouter()


from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="The user message to send to the AI")


class ChatResponse(BaseModel):
    response: str


from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from models.user import User
from models.chat import ChatMessage
from database import get_db
from api.deps import get_optional_current_user

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user)
) -> Any:
    response_text = chat_engine.respond(request.message)
    
    user_id = current_user.id if current_user else None
    
    # Save user message
    db_msg_user = ChatMessage(user_id=user_id, role="user", content=request.message)
    db.add(db_msg_user)
    
    # Save AI response
    db_msg_ai = ChatMessage(user_id=user_id, role="ai", content=response_text)
    db.add(db_msg_ai)
    
    await db.commit()

    return ChatResponse(response=response_text)
