"""Database repository — async CRUD for all tables."""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timedelta

from .connection import get_db


# ── Analyses ──────────────────────────────────────────────────────────


async def save_analysis(
    *,
    analysis_id: str,
    input_type: str,
    raw_input: str | None,
    extracted_text: str | None,
    risk_score: int,
    risk_level: str,
    verdict: str,
    evidence: list[dict],
    recommendations: list[str],
    next_steps: list[str],
    confidence: float,
    model_used: str | None,
    latency_ms: int,
    ip_hash: str | None = None,
) -> None:
    """Persist an analysis result."""
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO analyses
               (id, created_at, input_type, raw_input, extracted_text,
                risk_score, risk_level, verdict, evidence_json,
                recommendations_json, next_steps_json, confidence,
                model_used, latency_ms, ip_hash)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                analysis_id,
                datetime.utcnow().isoformat(),
                input_type,
                raw_input,
                extracted_text,
                risk_score,
                risk_level,
                verdict,
                json.dumps(evidence),
                json.dumps(recommendations),
                json.dumps(next_steps),
                confidence,
                model_used,
                latency_ms,
                ip_hash,
            ),
        )
        await db.commit()
    finally:
        await db.close()


async def get_analysis(analysis_id: str) -> dict | None:
    """Retrieve a single analysis by ID."""
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM analyses WHERE id = ? AND deleted_at IS NULL",
            (analysis_id,),
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return _row_to_analysis(row)
    finally:
        await db.close()


async def get_history(
    page: int = 1,
    per_page: int = 20,
    risk_level: str | None = None,
) -> tuple[list[dict], int]:
    """Retrieve paginated analysis history."""
    db = await get_db()
    try:
        where = "WHERE deleted_at IS NULL"
        params: list = []
        if risk_level:
            where += " AND risk_level = ?"
            params.append(risk_level)

        count_cursor = await db.execute(
            f"SELECT COUNT(*) FROM analyses {where}", params
        )
        count_row = await count_cursor.fetchone()
        total: int = count_row[0] if count_row is not None else 0

        offset = (page - 1) * per_page
        cursor = await db.execute(
            f"""SELECT * FROM analyses {where}
                ORDER BY created_at DESC LIMIT ? OFFSET ?""",
            [*params, per_page, offset],
        )
        rows = await cursor.fetchall()
        return [_row_to_analysis(r) for r in rows], total
    finally:
        await db.close()


async def get_stats() -> dict:
    """Get aggregate statistics."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """SELECT
                 COUNT(*) as total,
                 COALESCE(AVG(risk_score), 0) as avg_score,
                 COALESCE(SUM(CASE WHEN risk_score >= 61 THEN 1 ELSE 0 END) * 100.0 / MAX(COUNT(*), 1), 0) as scam_rate
               FROM analyses WHERE deleted_at IS NULL"""
        )
        row = await cursor.fetchone()

        # Last 7 days breakdown
        seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
        day_cursor = await db.execute(
            """SELECT DATE(created_at) as day, COUNT(*) as cnt
               FROM analyses
               WHERE deleted_at IS NULL AND created_at >= ?
               GROUP BY DATE(created_at)
               ORDER BY day""",
            (seven_days_ago,),
        )
        day_rows = await day_cursor.fetchall()
        by_day = {r[0]: r[1] for r in day_rows}

        if row is None:
            return {
                "total_analyses": 0,
                "avg_risk_score": 0.0,
                "scam_rate_pct": 0.0,
                "analyses_by_day": by_day,
            }

        return {
            "total_analyses": row[0],
            "avg_risk_score": round(row[1], 1),
            "scam_rate_pct": round(row[2], 1),
            "analyses_by_day": by_day,
        }
    finally:
        await db.close()


def _row_to_analysis(row) -> dict:
    """Convert a database row to an analysis dict."""
    return {
        "analysis_id": row["id"],
        "created_at": row["created_at"],
        "input_type": row["input_type"],
        "raw_input": row["raw_input"],
        "extracted_text": row["extracted_text"],
        "risk_score": row["risk_score"],
        "risk_level": row["risk_level"],
        "verdict": row["verdict"],
        "evidence": json.loads(row["evidence_json"]),
        "recommendations": json.loads(row["recommendations_json"]),
        "next_steps": json.loads(row["next_steps_json"]),
        "confidence": row["confidence"],
        "model_used": row["model_used"],
        "latency_ms": row["latency_ms"],
    }


# ── Feedback ──────────────────────────────────────────────────────────


async def save_feedback(
    *,
    analysis_id: str,
    rating: int,
    comment: str | None = None,
    was_actually_scam: bool | None = None,
) -> str:
    """Save user feedback for an analysis."""
    feedback_id = str(uuid.uuid4())
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO feedback (id, analysis_id, created_at, rating, user_comment, was_actually_scam)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                feedback_id,
                analysis_id,
                datetime.utcnow().isoformat(),
                rating,
                comment,
                (
                    1
                    if was_actually_scam is True
                    else (0 if was_actually_scam is False else None)
                ),
            ),
        )
        await db.commit()
        return feedback_id
    finally:
        await db.close()


# ── URL Cache ─────────────────────────────────────────────────────────


async def get_cached_url(url_hash: str) -> dict | None:
    """Get a cached URL scan result if not expired."""
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM url_cache WHERE url_hash = ? AND expires_at > ?",
            (url_hash, datetime.utcnow().isoformat()),
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return {
            "is_safe": bool(row["is_safe"]),
            "threat_type": row["threat_type"],
            "raw_result": json.loads(row["raw_result_json"]),
        }
    finally:
        await db.close()


async def cache_url(
    url_hash: str, is_safe: bool, threat_type: str | None, raw_result: dict
) -> None:
    """Cache a URL scan result for 24 hours."""
    db = await get_db()
    try:
        cache_id = str(uuid.uuid4())
        expires = (datetime.utcnow() + timedelta(hours=24)).isoformat()
        await db.execute(
            """INSERT OR REPLACE INTO url_cache
               (id, url_hash, scanned_at, is_safe, threat_type, raw_result_json, expires_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                cache_id,
                url_hash,
                datetime.utcnow().isoformat(),
                int(is_safe),
                threat_type,
                json.dumps(raw_result),
                expires,
            ),
        )
        await db.commit()
    finally:
        await db.close()
