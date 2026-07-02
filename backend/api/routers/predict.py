from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from ml.predictor import predictor
from models.user import User
from models.prediction import Prediction
from database import get_db
from api.deps import get_optional_current_user

router = APIRouter()

from pydantic import BaseModel, field_validator, ValidationInfo
import fastapi

class PredictionRequest(BaseModel):
    symptoms: str | list[str]

    @field_validator('symptoms')
    @classmethod
    def validate_symptoms(cls, v: str | list[str], info: ValidationInfo) -> str | list[str]:
        # Limit total characters to 1000
        text = v if isinstance(v, str) else " ".join(v)
        if not text.strip():
            raise ValueError('Symptoms cannot be empty')
        if len(text) > 1000:
            raise ValueError('Symptoms text too long (max 1000 characters)')
        return v

class DifferentialDiagnosis(BaseModel):
    disease: str
    confidence: float

class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    specialist: str
    differentials: list[DifferentialDiagnosis] = []
    model: str = "unknown"

@router.post("/", response_model=PredictionResponse)
async def predict_disease(
    request: PredictionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user)
) -> Any:
    # Normalise input — frontend may send a string or list
    if isinstance(request.symptoms, list):
        symptoms_text = " ".join(request.symptoms)
    else:
        symptoms_text = request.symptoms

    result = predictor.predict(symptoms_text)
    
    # Save to database
    db_pred = Prediction(
        user_id=current_user.id if current_user else None,
        symptoms=symptoms_text,
        predicted_disease=result["disease"],
        confidence=result["confidence"],
        suggested_specialist=result["specialist"]
    )
    db.add(db_pred)
    await db.commit()

    return PredictionResponse(**result)


@router.get("/status")
async def model_status() -> dict:
    """Return the current status of the ML model."""
    return predictor.model_info
