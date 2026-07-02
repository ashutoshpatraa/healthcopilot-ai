from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from database import get_db
from models.prediction import Prediction
from models.chat import ChatMessage
from models.report import Report

router = APIRouter()

class AnalyticsResponse(BaseModel):
    total_predictions: int
    total_chats: int
    total_reports: int
    avg_confidence: float
    top_diseases: list[dict]
    recent_activity: list[dict] = []

@router.get("/", response_model=AnalyticsResponse)
async def get_analytics(
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Get total predictions
    result_pred = await db.execute(select(func.count(Prediction.id)))
    total_predictions = result_pred.scalar() or 0

    # Get total chats
    result_chat = await db.execute(select(func.count(ChatMessage.id)))
    total_chats = result_chat.scalar() or 0

    # Get total reports
    result_rep = await db.execute(select(func.count(Report.id)))
    total_reports = result_rep.scalar() or 0

    # Get average confidence of predictions
    result_conf = await db.execute(select(func.avg(Prediction.confidence)))
    avg_conf = result_conf.scalar() or 0.0

    # Get top predicted diseases
    result_top = await db.execute(
        select(Prediction.predicted_disease, func.count(Prediction.id).label('count'))
        .group_by(Prediction.predicted_disease)
        .order_by(func.count(Prediction.id).desc())
        .limit(5)
    )
    
    top_diseases = []
    for row in result_top:
        top_diseases.append({"disease": row.predicted_disease, "count": row.count})

    # Get recent predictions for dashboard activity
    result_recent = await db.execute(
        select(Prediction)
        .order_by(Prediction.created_at.desc())
        .limit(5)
    )
    recent_activity = []
    for pred in result_recent.scalars():
        recent_activity.append({
            "date": pred.created_at.strftime("%Y-%m-%d") if pred.created_at else "N/A",
            "event": f"AI Check: {pred.predicted_disease}",
            "status": "COMPLETED"
        })

    return AnalyticsResponse(
        total_predictions=total_predictions,
        total_chats=total_chats,
        total_reports=total_reports,
        avg_confidence=round(avg_conf, 2),
        top_diseases=top_diseases,
        recent_activity=recent_activity
    )
