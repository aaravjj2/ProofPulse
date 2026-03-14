"""Prompt templates for different analysis types."""


def text_prompt(text: str, context: str | None = None) -> str:
    ctx = f"\n\nAdditional context provided by the user: {context}" if context else ""
    return f"Analyze this message for scam/fraud indicators:\n\n---\n{text}\n---{ctx}"


def image_prompt(extracted_text: str) -> str:
    return (
        f"The following text was extracted from a screenshot via OCR. "
        f"Analyze it for scam/fraud indicators:\n\n---\n{extracted_text}\n---"
    )


def url_prompt(url: str, scan_signals: dict) -> str:
    signals_text = "\n".join(f"- {k}: {v}" for k, v in scan_signals.items())
    return (
        f"Analyze this URL for scam/phishing indicators:\n\n"
        f"URL: {url}\n\n"
        f"Automated scan signals:\n{signals_text}"
    )


def scenario_prompt(
    text: str | None, url: str | None, ocr_text: str | None, context: str | None
) -> str:
    parts = []
    if text:
        parts.append(f"Message text:\n{text}")
    if url:
        parts.append(f"URL: {url}")
    if ocr_text:
        parts.append(f"Text extracted from screenshot:\n{ocr_text}")
    if context:
        parts.append(f"Additional context: {context}")
    combined = "\n\n".join(parts)
    return (
        f"Analyze this complete scenario for scam/fraud indicators. "
        f"Consider all inputs together:\n\n---\n{combined}\n---"
    )
