"""OCR text extraction service using Tesseract."""

from __future__ import annotations

import io
import re
import time

import structlog
from PIL import Image, ImageFilter

logger = structlog.get_logger()


async def extract_text_from_image(image_bytes: bytes) -> tuple[str, float]:
    """Extract text from image bytes using Tesseract OCR.

    Returns (extracted_text, confidence).
    """
    if not image_bytes:
        return "", 0.0

    start = time.time()

    try:
        import pytesseract
    except ImportError:
        logger.warning("pytesseract_not_installed")
        return "", 0.0

    try:
        img_raw = Image.open(io.BytesIO(image_bytes))
        img: Image.Image = img_raw.convert("L")  # grayscale
        img = img.filter(ImageFilter.SHARPEN)

        # Try default PSM first
        data = pytesseract.image_to_data(
            img, output_type=pytesseract.Output.DICT, config="--psm 6"
        )
        text = " ".join(
            word
            for word, conf in zip(data["text"], data["conf"])
            if int(conf) > 30 and word.strip()
        )

        # Fallback if too little text
        if len(text.strip()) < 10:
            text = pytesseract.image_to_string(img, config="--psm 4").strip()

        # Compute average confidence
        confidences = [int(c) for c in data["conf"] if int(c) > 0]
        avg_conf = sum(confidences) / len(confidences) / 100 if confidences else 0.0

        cleaned = _clean_ocr_text(text)
        elapsed = time.time() - start
        logger.info(
            "ocr_complete",
            chars=len(cleaned),
            confidence=avg_conf,
            ms=int(elapsed * 1000),
        )
        return cleaned, round(avg_conf, 2)

    except Exception as e:
        logger.error("ocr_failed", error=str(e))
        return "", 0.0


def _clean_ocr_text(text: str) -> str:
    """Clean and normalize OCR-extracted text."""
    if not text:
        return ""
    # Remove common OCR artifacts
    text = re.sub(r"[|}{~`]", "", text)
    # Normalize smart quotes
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text)
    return text.strip()
