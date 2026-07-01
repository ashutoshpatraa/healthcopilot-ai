from typing import Any
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from services import ocr_service

router = APIRouter()


class UploadResponse(BaseModel):
    summary: str
    extracted_text: str
    method: str = "unknown"


@router.post("/", response_model=UploadResponse)
async def upload_report(file: UploadFile = File(...)) -> Any:
    file_bytes = await file.read()
    content_type = file.content_type or ""
    result = await ocr_service.extract(file_bytes, file.filename or "upload", content_type)
    return UploadResponse(**result)
