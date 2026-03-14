"""URL scanning and analysis service."""

from __future__ import annotations

import hashlib
import re
from urllib.parse import urlparse

import structlog

from ..db import repository

logger = structlog.get_logger()

SUSPICIOUS_TLDS = {".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".pw", ".top", ".buzz", ".ru", ".cn"}

BRAND_KEYWORDS = [
    "amazon", "paypal", "apple", "google", "microsoft", "netflix", "chase",
    "wellsfargo", "bankofamerica", "citibank", "facebook", "instagram",
    "twitter", "linkedin", "dropbox", "coinbase", "venmo", "zelle",
]

URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
    "buff.ly", "rb.gy", "shorturl.at",
}

SUSPICIOUS_PATH_KEYWORDS = {
    "login", "signin", "verify", "secure", "account", "update",
    "confirm", "validate", "authenticate", "reset", "password",
}

HOMOGLYPHS = {
    "o": "0", "l": "1", "i": "1", "e": "3", "a": "@", "s": "$",
}


async def analyze_url(url: str) -> dict:
    """Analyze a URL for scam/phishing indicators.

    Returns a dict of signals for LLM consumption.
    """
    url_hash = hashlib.sha256(url.encode()).hexdigest()

    # Check cache
    cached = await repository.get_cached_url(url_hash)
    if cached:
        logger.info("url_cache_hit", url=url[:50])
        return cached.get("raw_result", {})

    signals = _extract_signals(url)

    # Cache the result
    is_safe = signals.get("risk_score", 0) < 30
    threat_type = signals.get("primary_threat")
    await repository.cache_url(url_hash, is_safe, threat_type, signals)

    return signals


def _extract_signals(url: str) -> dict:
    """Extract all URL-based signals."""
    signals: dict = {}
    risk_score = 0

    # Normalize
    if url.startswith("www."):
        url = "https://" + url

    try:
        parsed = urlparse(url)
    except Exception:
        return {"error": "Invalid URL", "risk_score": 50}

    domain = parsed.hostname or ""
    path = parsed.path.lower()

    # Scheme check
    if parsed.scheme != "https":
        signals["no_https"] = True
        risk_score += 10

    # IP-based URL
    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain):
        signals["ip_based_url"] = True
        risk_score += 25

    # Suspicious TLD
    tld = "." + domain.split(".")[-1] if "." in domain else ""
    if tld in SUSPICIOUS_TLDS:
        signals["suspicious_tld"] = tld
        risk_score += 20

    # Subdomain depth
    parts = domain.split(".")
    if len(parts) > 3:
        signals["excessive_subdomains"] = len(parts)
        risk_score += 10

    # URL shortener
    if domain in URL_SHORTENERS:
        signals["url_shortener"] = True
        risk_score += 15

    # Brand typosquatting
    domain_lower = domain.lower().replace("-", "").replace(".", "")
    for brand in BRAND_KEYWORDS:
        if brand in domain_lower and brand + ".com" not in domain and brand + ".org" not in domain:
            signals["brand_impersonation"] = brand
            risk_score += 30
            break

    # Number substitution (homoglyphs)
    for char, sub in HOMOGLYPHS.items():
        if sub in domain_lower:
            for brand in BRAND_KEYWORDS:
                swapped = brand.replace(char, sub)
                if swapped != brand and swapped in domain_lower:
                    signals["homoglyph_attack"] = f"{char}→{sub} in domain"
                    risk_score += 25
                    break

    # Suspicious path keywords
    path_flags = [kw for kw in SUSPICIOUS_PATH_KEYWORDS if kw in path]
    if path_flags:
        signals["suspicious_path"] = path_flags
        risk_score += 5 * len(path_flags)

    # Long/complex URL
    if len(url) > 200:
        signals["excessive_length"] = len(url)
        risk_score += 5

    # Determine primary threat
    if risk_score >= 50:
        signals["primary_threat"] = "phishing"
    elif risk_score >= 30:
        signals["primary_threat"] = "suspicious"
    else:
        signals["primary_threat"] = None

    signals["risk_score"] = min(risk_score, 100)
    signals["domain"] = domain
    signals["scheme"] = parsed.scheme

    return signals
