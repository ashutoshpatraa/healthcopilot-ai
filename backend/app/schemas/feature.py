from datetime import datetime

from pydantic import BaseModel, Field


class ProfileUpdateRequest(BaseModel):
    age: int | None = Field(default=None, ge=0, le=130)
    sex: str | None = None
    weight_kg: float | None = Field(default=None, ge=0)
    height_cm: float | None = Field(default=None, ge=0)
    allergies: str | None = None
    medications: str | None = None


class PredictionRequest(BaseModel):
    symptoms: list[str]


class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    risk_score: float
    specialist: str


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


class ReportResponse(BaseModel):
    id: int
    file_name: str
    summary: str | None = None
    created_at: datetime


class DashboardResponse(BaseModel):
    total_predictions: int
    total_reports: int
    total_notifications: int
    risk_trend: list[float]
