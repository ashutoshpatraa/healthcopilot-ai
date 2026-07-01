from typing import Any
from fastapi import APIRouter, Depends
from models.user import User
from api.deps import get_current_active_user
from pydantic import BaseModel

router = APIRouter()

class PredictionRequest(BaseModel):
    symptoms: list[str]

class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    specialist: str

@router.post("/", response_model=PredictionResponse)
async def predict_disease(
    request: PredictionRequest,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    # TODO: Implement actual ML inference
    return PredictionResponse(
        disease="Sample Disease",
        confidence=0.95,
        specialist="General Physician"
    )
