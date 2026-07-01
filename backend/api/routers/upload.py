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
    # TODO: Implement EasyOCR and pdfplumber logic
    return UploadResponse(
        summary="Sample report summary.",
        extracted_text="Sample extracted text from the medical report."
    )
