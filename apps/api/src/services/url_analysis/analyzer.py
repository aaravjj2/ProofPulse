"""URL analysis service for domain and pattern checks."""

from __future__ import annotations

import re
from dataclasses import dataclass
from urllib.parse import urlparse

from ...types.analysis import Evidence


@dataclass(frozen=True)
class URLAnalysisResult:
    score: int
    flags: list[str]
    evidence: list[Evidence]
    domain: str
    is_suspicious: bool


SUSPICIOUS_TLDS = {
    ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club",
    ".work", ".click", ".link", ".info", ".biz", ".icu", ".buzz",
}

TRUSTED_DOMAINS = {
    "google.com", "microsoft.com", "apple.com", "amazon.com",
    "paypal.com", "chase.com", "bankofamerica.com", "wells fargo.com",
    "github.com", "linkedin.com", "facebook.com", "twitter.com",
}

BRAND_KEYWORDS = [
    "paypal", "apple", "google", "microsoft", "amazon", "chase",
    "wells", "fargo", "bank", "netflix", "instagram", "facebook",
    "whatsapp", "telegram", "venmo", "zelle", "coinbase",
]


def analyze_url(url: str, context: str = "other") -> URLAnalysisResult:
    """Analyze a URL for suspicious patterns."""
    score = 0
    flags: list[str] = []
    evidence: list[Evidence] = []

    # Normalize
    if url.startswith("www."):
        url = "https://" + url

    try:
        parsed = urlparse(url)
    except Exception:
        return URLAnalysisResult(
            score=50,
            flags=["malformed URL"],
            evidence=[Evidence(type="url", value=url, reason="Could not parse URL")],
            domain=url,
            is_suspicious=True,
        )

    domain = parsed.hostname or ""
    path = parsed.path or ""
    full_url = url.lower()

    # Check TLD
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            score += 15
            flags.append("suspicious TLD")
            evidence.append(Evidence(type="domain", value=tld, reason="commonly abused TLD"))
            break

    # Check for IP-based URLs
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain):
        score += 25
        flags.append("IP address instead of domain")
        evidence.append(Evidence(type="domain", value=domain, reason="IP-based URL is suspicious"))

    # Typosquatting detection
    for brand in BRAND_KEYWORDS:
        if brand in domain and domain not in TRUSTED_DOMAINS:
            # Check if it's a subdomain of a trusted domain
            is_trusted = any(domain.endswith("." + td) for td in TRUSTED_DOMAINS)
            if not is_trusted:
                score += 20
                flags.append("possible typosquatting")
                evidence.append(Evidence(
                    type="domain",
                    value=domain,
                    reason=f"contains brand '{brand}' but is not the official domain",
                ))
                break

    # Excessive subdomains
    subdomain_count = domain.count(".")
    if subdomain_count > 3:
        score += 10
        flags.append("excessive subdomains")
        evidence.append(Evidence(type="domain", value=domain, reason="too many subdomains"))

    # Long domain name
    if len(domain) > 40:
        score += 10
        flags.append("unusually long domain")

    # Suspicious path patterns
    suspicious_paths = ["/login", "/signin", "/verify", "/secure", "/account", "/update", "/confirm"]
    for sp in suspicious_paths:
        if sp in path.lower():
            score += 8
            flags.append("suspicious path pattern")
            evidence.append(Evidence(type="url", value=path, reason=f"path contains '{sp}'"))
            break

    # HTTP without TLS
    if parsed.scheme == "http":
        score += 10
        flags.append("no HTTPS")
        evidence.append(Evidence(type="url", value="http://", reason="connection is not encrypted"))

    # Homograph detection (mixed scripts in domain)
    if any(ord(c) > 127 for c in domain):
        score += 20
        flags.append("internationalized domain (possible homograph)")
        evidence.append(Evidence(type="domain", value=domain, reason="non-ASCII characters in domain"))

    # Context-based scoring boost
    if context in ("banking", "login") and score > 0:
        score = min(100, int(score * 1.3))

    score = min(score, 100)

    return URLAnalysisResult(
        score=score,
        flags=flags,
        evidence=evidence,
        domain=domain,
        is_suspicious=score > 30,
    )
