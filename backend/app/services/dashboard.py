from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.entities import Notification, Prediction, Report


def build_dashboard_summary(db: Session) -> dict[str, object]:
    total_predictions = db.query(func.count(Prediction.id)).scalar() or 0
    total_reports = db.query(func.count(Report.id)).scalar() or 0
    total_notifications = db.query(func.count(Notification.id)).scalar() or 0
    risk_values = [row[0] for row in db.query(Prediction.risk_score).order_by(Prediction.created_at.desc()).limit(10).all()]
    return {
        "total_predictions": total_predictions,
        "total_reports": total_reports,
        "total_notifications": total_notifications,
        "risk_trend": risk_values,
    }
