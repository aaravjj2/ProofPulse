"""OCR service using Tesseract for screenshot text extraction."""

from __future__ import annotations

import io
import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class OCRResult:
    text: str
    confidence: float
    success: bool
    error: str | None = None


async def extract_text_from_image(image_bytes: bytes) -> OCRResult:
    """Extract text from an image using Tesseract OCR.

    Falls back gracefully if Tesseract is not installed.
    """
    try:
        import pytesseract
        from PIL import Image

        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB if needed
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        # Get detailed data for confidence
        data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        texts = []
        confidences = []

        for i, text in enumerate(data["text"]):
            conf = int(data["conf"][i])
            if conf > 0 and text.strip():
                texts.append(text)
                confidences.append(conf)

        extracted_text = " ".join(texts)
        avg_confidence = sum(confidences) / len(confidences) / 100.0 if confidences else 0.0

        return OCRResult(
            text=extracted_text,
            confidence=round(avg_confidence, 2),
            success=bool(extracted_text),
        )

    except ImportError:
        logger.warning("pytesseract not installed, using fallback OCR")
        return OCRResult(
            text="",
            confidence=0.0,
            success=False,
            error="OCR not available - tesseract not installed",
        )
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        return OCRResult(
            text="",
            confidence=0.0,
            success=False,
            error=str(e),
        )


def clean_ocr_text(text: str) -> str:
    """Clean and normalize OCR-extracted text."""
    import re

    # Remove excessive whitespace
    text = re.sub(r"\s+", " ", text)
    # Remove common OCR artifacts
    text = re.sub(r"[|}{~`]", "", text)
    # Normalize quotes
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2018", "'").replace("\u2019", "'")

    return text.strip()
