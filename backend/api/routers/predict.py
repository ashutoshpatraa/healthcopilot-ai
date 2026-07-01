from typing import Any
from fastapi import APIRouter
from pydantic import BaseModel
from ml.predictor import predictor

router = APIRouter()


class PredictionRequest(BaseModel):
    symptoms: str | list[str]


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
async def predict_disease(request: PredictionRequest) -> Any:
    # Normalise input — frontend may send a string or list
    if isinstance(request.symptoms, list):
        symptoms_text = " ".join(request.symptoms)
    else:
        symptoms_text = request.symptoms

    result = predictor.predict(symptoms_text)
    return PredictionResponse(**result)


@router.get("/status")
async def model_status() -> dict:
    """Return the current status of the ML model."""
    return predictor.model_info
