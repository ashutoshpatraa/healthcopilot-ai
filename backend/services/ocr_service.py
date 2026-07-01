"""
OCR Service for HealthCopilot AI
Handles real text extraction from medical PDFs and images.
Uses pdfplumber for PDFs and EasyOCR for images.
"""
import io
import logging
import tempfile
from pathlib import Path
from typing import Union

logger = logging.getLogger(__name__)

# Keywords that flag abnormal lab values
ABNORMAL_KEYWORDS = [
    "high", "low", "elevated", "abnormal", "critical", "flagged",
    "positive", "*", "↑", "↓", "H ", " L ", "CRIT"
]

MEDICAL_SECTION_HEADERS = [
    "complete blood count", "cbc", "metabolic panel", "lipid panel",
    "liver function", "kidney function", "thyroid", "urinalysis",
    "radiology", "impression", "diagnosis", "findings", "conclusion"
]


def _summarise_extracted_text(text: str) -> str:
    """Generate a brief AI summary of the extracted medical document text."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    abnormal_lines = [l for l in lines if any(kw.lower() in l.lower() for kw in ABNORMAL_KEYWORDS)]
    sections_found = [h for h in MEDICAL_SECTION_HEADERS if h in text.lower()]

    parts = []
    if sections_found:
        parts.append(f"Document contains: {', '.join(s.title() for s in sections_found[:4])}.")
    if abnormal_lines:
        count = len(abnormal_lines)
        parts.append(
            f"Found {count} potentially flagged value{'s' if count > 1 else ''} "
            f"requiring attention."
        )
        if abnormal_lines[:2]:
            parts.append("Notable: " + "; ".join(abnormal_lines[:2]) + ".")
    else:
        parts.append("No critical flags detected in extracted values.")

    if not parts:
        return "Document processed successfully. Please review the extracted text."

    return " ".join(parts) + " Consult your healthcare provider for interpretation."


async def extract_pdf(file_bytes: bytes, filename: str) -> dict:
    """Extract text from a PDF using pdfplumber."""
    try:
        import pdfplumber
        text_parts = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(f"--- Page {i+1} ---\n{page_text}")
        extracted = "\n\n".join(text_parts)
        if not extracted.strip():
            extracted = "(No readable text found in PDF – may be a scanned image)"
        summary = _summarise_extracted_text(extracted)
        logger.info("PDF extraction complete: %d chars from %s", len(extracted), filename)
        return {"extracted_text": extracted, "summary": summary, "method": "pdfplumber"}
    except Exception as e:
        logger.error("PDF extraction failed: %s", e)
        return {
            "extracted_text": f"PDF extraction failed: {e}",
            "summary": "Could not process the PDF file. Please ensure it is a valid, non-corrupted PDF.",
            "method": "error"
        }


async def extract_image(file_bytes: bytes, filename: str) -> dict:
    """Extract text from an image using EasyOCR."""
    try:
        import easyocr
        import numpy as np
        from PIL import Image

        reader = easyocr.Reader(["en"], gpu=False, verbose=False)
        img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        img_array = np.array(img)
        results = reader.readtext(img_array, detail=1, paragraph=False)

        # Filter by confidence threshold
        lines = [text for (_, text, conf) in results if conf > 0.3]
        extracted = "\n".join(lines) if lines else "(No text detected in image)"

        summary = _summarise_extracted_text(extracted)
        logger.info("Image OCR complete: %d text regions from %s", len(results), filename)
        return {"extracted_text": extracted, "summary": summary, "method": "easyocr"}
    except Exception as e:
        logger.error("Image OCR failed: %s", e)
        return {
            "extracted_text": f"Image OCR failed: {e}",
            "summary": "Could not process the image. Please ensure it is a clear JPG or PNG.",
            "method": "error"
        }


async def extract(file_bytes: bytes, filename: str, content_type: str) -> dict:
    """Route to the appropriate extractor based on file type."""
    filename_lower = filename.lower()
    if content_type == "application/pdf" or filename_lower.endswith(".pdf"):
        return await extract_pdf(file_bytes, filename)
    elif content_type.startswith("image/") or filename_lower.endswith((".jpg", ".jpeg", ".png")):
        return await extract_image(file_bytes, filename)
    else:
        return {
            "extracted_text": "Unsupported file type.",
            "summary": f"File type '{content_type}' is not supported. Please upload a PDF, JPG, or PNG.",
            "method": "unsupported"
        }
