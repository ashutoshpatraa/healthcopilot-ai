from typing import Any
from fastapi import APIRouter, Depends, UploadFile, File
from models.user import User
from api.deps import get_current_active_user
from pydantic import BaseModel

router = APIRouter()

class UploadResponse(BaseModel):
    summary: str
    extracted_text: str

@router.post("/", response_model=UploadResponse)
async def upload_report(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    # Simulated OCR extraction using EasyOCR
    # reader = easyocr.Reader(['en'])
    # result = reader.readtext(file.file.read())
    
    extracted = f"Extracted contents from {file.filename} using OCR."
    summary = "Blood test indicates normal hemoglobin levels. No immediate concerns."
    
    return UploadResponse(
        summary=summary,
        extracted_text=extracted
    )
