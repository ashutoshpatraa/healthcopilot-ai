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
    # Simulate ML inference (loads model if it exists, otherwise mock)
    # In production, you would load joblib.load('best_model.pkl')
    # and run model.predict(request.symptoms)
    
    disease = "Common Cold" if "cough" in request.symptoms else "Unknown"
    confidence = 0.85
    specialist = "General Physician"
    
    return PredictionResponse(
        disease=disease,
        confidence=confidence,
        specialist=specialist
    )
