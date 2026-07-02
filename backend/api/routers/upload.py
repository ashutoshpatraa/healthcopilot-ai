from typing import Any
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from services import ocr_service

router = APIRouter()


class UploadResponse(BaseModel):
    summary: str
    extracted_text: str
    method: str = "unknown"


from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from models.user import User
from models.report import Report
from database import get_db
from api.deps import get_optional_current_user

@router.post("/", response_model=UploadResponse)
async def upload_report(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user)
) -> Any:
    file_bytes = await file.read()
    if len(file_bytes) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB.")
    if not file_bytes:
        raise HTTPException(status_code=400, detail="File is empty.")
    content_type = file.content_type or ""
    result = await ocr_service.extract(file_bytes, file.filename or "upload", content_type)
    
    # Save to database
    db_report = Report(
        user_id=current_user.id if current_user else None,
        filename=file.filename or "upload",
        extracted_text=result["extracted_text"],
        summary=result["summary"]
    )
    db.add(db_report)
    await db.commit()
    
    return UploadResponse(**result)
