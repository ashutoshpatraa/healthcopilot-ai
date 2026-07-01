from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.deps import db_session
from app.models.entities import ChatMessage, MedicalProfile, Prediction, Report
from app.schemas.feature import ChatRequest, ChatResponse, DashboardResponse, PredictionRequest, PredictionResponse, ProfileUpdateRequest, ReportResponse
from app.services.chat import generate_medical_reply
from app.services.dashboard import build_dashboard_summary
from app.services.auth import ensure_demo_user
from app.services.prediction import predict_disease

router = APIRouter(tags=["health"])


@router.get("/profile")
def get_profile(db: Session = Depends(db_session)) -> dict[str, object]:
    demo_user = ensure_demo_user(db)
    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == demo_user.id).first()
    return {"profile": None if profile is None else {"age": profile.age, "sex": profile.sex, "weight_kg": profile.weight_kg, "height_cm": profile.height_cm, "allergies": profile.allergies, "medications": profile.medications}}


@router.put("/profile")
def update_profile(payload: ProfileUpdateRequest, db: Session = Depends(db_session)) -> dict[str, object]:
    demo_user = ensure_demo_user(db)
    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == demo_user.id).first()
    if profile is None:
        profile = MedicalProfile(user_id=demo_user.id)
        db.add(profile)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    db.commit()
    return {"status": "updated"}


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest, db: Session = Depends(db_session)) -> PredictionResponse:
    demo_user = ensure_demo_user(db)
    disease, confidence, risk_score, specialist = predict_disease(payload.symptoms)
    db.add(Prediction(user_id=demo_user.id, symptoms_csv=",".join(payload.symptoms), confidence=confidence, risk_score=risk_score, specialist=specialist))
    db.commit()
    return PredictionResponse(disease=disease, confidence=confidence, risk_score=risk_score, specialist=specialist)


@router.post("/upload", response_model=ReportResponse)
async def upload_report(file: UploadFile = File(...), db: Session = Depends(db_session)) -> ReportResponse:
    demo_user = ensure_demo_user(db)
    report = Report(user_id=demo_user.id, file_name=file.filename or "report", extracted_text=f"Uploaded report: {file.filename}", summary="Report upload received and stored.")
    db.add(report)
    db.commit()
    db.refresh(report)
    return ReportResponse(id=report.id, file_name=report.file_name, summary=report.summary, created_at=report.created_at)


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(db_session)) -> ChatResponse:
    demo_user = ensure_demo_user(db)
    db.add(ChatMessage(user_id=demo_user.id, role="user", content=payload.message))
    reply = generate_medical_reply(payload.message)
    db.add(ChatMessage(user_id=demo_user.id, role="assistant", content=reply))
    db.commit()
    return ChatResponse(reply=reply)


@router.get("/history")
def history(db: Session = Depends(db_session)) -> dict[str, object]:
    messages = db.query(ChatMessage).order_by(ChatMessage.created_at.desc()).limit(20).all()
    return {"messages": [{"role": message.role, "content": message.content, "created_at": message.created_at} for message in messages]}


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(db: Session = Depends(db_session)) -> DashboardResponse:
    summary = build_dashboard_summary(db)
    return DashboardResponse(**summary)


@router.get("/admin")
def admin() -> dict[str, str]:
    return {"message": "Admin overview is available behind role-based protection in the next iteration."}


@router.get("/analytics")
def analytics(db: Session = Depends(db_session)) -> dict[str, object]:
    return {"analytics": build_dashboard_summary(db)}
