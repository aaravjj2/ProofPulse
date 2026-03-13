"""Pydantic models for ProofPulse analysis pipeline."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class SourceType(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    CHAT = "chat"
    OTHER = "other"


class URLContext(str, Enum):
    BANKING = "banking"
    MARKETPLACE = "marketplace"
    LOGIN = "login"
    OTHER = "other"


class ScenarioType(str, Enum):
    JOB_SCAM = "job_scam"
    PAYMENT_SCAM = "payment_scam"
    PHISHING = "phishing"
    IMPERSONATION = "impersonation"
    MISINFORMATION = "misinformation"


class RiskLabel(str, Enum):
    SAFE = "safe"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ThreatCategory(str, Enum):
    PHISHING = "phishing"
    JOB_SCAM = "job_scam"
    PAYMENT_SCAM = "payment_scam"
    IMPERSONATION = "impersonation"
    MISINFORMATION = "misinformation"
    MALWARE = "malware"
    SOCIAL_ENGINEERING = "social_engineering"
    SAFE = "safe"
    UNKNOWN = "unknown"


class FeedbackRating(str, Enum):
    ACCURATE = "accurate"
    INACCURATE = "inaccurate"
    UNSURE = "unsure"


class Evidence(BaseModel):
    type: str = Field(..., description="Evidence type: phrase, pattern, domain, url")
    value: str = Field(..., description="The detected evidence value")
    reason: str = Field(..., description="Why this is flagged")


class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    source: SourceType = SourceType.OTHER
    locale: str = Field(default="en-US", max_length=10)

    @field_validator("text")
    @classmethod
    def text_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Text cannot be empty or whitespace only")
        return stripped


class ImageAnalysisRequest(BaseModel):
    source: SourceType = SourceType.OTHER
    locale: str = Field(default="en-US", max_length=10)


class URLAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048)
    context: URLContext = URLContext.OTHER

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL cannot be empty")
        if not v.startswith(("http://", "https://", "www.")):
            raise ValueError("URL must start with http://, https://, or www.")
        return v


class ScenarioAnalysisRequest(BaseModel):
    scenario: ScenarioType
    text: Optional[str] = Field(default=None, max_length=10000)
    url: Optional[str] = Field(default=None, max_length=2048)
    image_id: Optional[str] = Field(default=None, max_length=100)


class AnalysisRequest(BaseModel):
    """Union wrapper for any analysis request type."""
    input_type: str
    text: Optional[str] = None
    url: Optional[str] = None
    source: SourceType = SourceType.OTHER
    locale: str = "en-US"


class AnalysisResponse(BaseModel):
    id: str = Field(..., description="Unique analysis ID")
    risk_score: int = Field(..., ge=0, le=100)
    risk_label: RiskLabel
    category: ThreatCategory
    confidence: float = Field(..., ge=0.0, le=1.0)
    flags: list[str] = Field(default_factory=list)
    evidence: list[Evidence] = Field(default_factory=list)
    explanation: str = Field(default="")
    next_steps: list[str] = Field(default_factory=list)
    safe_reply: Optional[str] = None
    normalized_text: Optional[str] = None
    ocr_text: Optional[str] = None
    ocr_confidence: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class FeedbackRequest(BaseModel):
    analysis_id: str = Field(..., min_length=1, max_length=100)
    rating: FeedbackRating
    note: Optional[str] = Field(default=None, max_length=1000)


class HistoryEntry(BaseModel):
    id: str
    input_type: str
    category: ThreatCategory
    risk_score: int
    risk_label: RiskLabel
    timestamp: datetime
    summary: str = ""
