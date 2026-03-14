"""Pydantic v2 models for ProofPulse API."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


# ── Enums / Literals ──────────────────────────────────────────────────

RiskLevel = Literal["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]
InputType = Literal["text", "image", "url", "scenario"]
EvidenceFlag = Literal["red", "yellow", "green"]


# ── Evidence ──────────────────────────────────────────────────────────


class EvidenceItem(BaseModel):
    label: str
    value: str
    weight: float = Field(ge=0.0, le=1.0)
    flag: EvidenceFlag


# ── Responses ─────────────────────────────────────────────────────────


class AnalysisResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    analysis_id: str
    risk_score: int = Field(ge=0, le=100)
    risk_level: RiskLevel
    verdict: str
    evidence: list[EvidenceItem]
    recommendations: list[str]
    next_steps: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    model_used: str
    latency_ms: int
    input_type: InputType


class HistoryItem(BaseModel):
    analysis_id: str
    created_at: str
    input_type: InputType
    risk_score: int
    risk_level: RiskLevel
    verdict: str


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
    total: int
    page: int
    per_page: int


class FeedbackResponse(BaseModel):
    feedback_id: str
    status: str = "ok"


class HealthResponse(BaseModel):
    status: str
    db_ok: bool
    openai_ok: bool
    version: str
    uptime_seconds: float


class StatsResponse(BaseModel):
    total_analyses: int
    avg_risk_score: float
    scam_rate_pct: float
    analyses_by_day: dict[str, int]


class ErrorResponse(BaseModel):
    code: int
    message: str
    request_id: str | None = None


# ── Requests ──────────────────────────────────────────────────────────


class TextAnalysisRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    text: str = Field(..., min_length=1, max_length=10000)
    context: str | None = None


class URLAnalysisRequest(BaseModel):
    url: str = Field(..., pattern=r"^https?://")
    follow_redirects: bool = True


class ScenarioAnalysisRequest(BaseModel):
    text: str | None = None
    url: str | None = None
    image_base64: str | None = None
    context: str | None = None

    @model_validator(mode="after")
    def at_least_one_input(self):
        if not any([self.text, self.url, self.image_base64]):
            raise ValueError(
                "At least one of text, url, or image_base64 must be provided"
            )
        return self


class FeedbackRequest(BaseModel):
    analysis_id: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None
    was_actually_scam: bool | None = None
