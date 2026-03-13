"""Tests for URL analysis service."""

import pytest
from apps.api.src.services.url_analysis.analyzer import analyze_url


class TestSuspiciousTLDs:
    def test_detects_suspicious_tld_tk(self):
        result = analyze_url("https://example.tk/login")
        assert result.score > 0
        assert "suspicious TLD" in result.flags

    def test_detects_suspicious_tld_xyz(self):
        result = analyze_url("https://verify-account.xyz")
        assert result.score > 0

    def test_normal_tld_no_flag(self):
        result = analyze_url("https://example.com")
        assert "suspicious TLD" not in result.flags


class TestIPBasedURLs:
    def test_detects_ip_url(self):
        result = analyze_url("http://192.168.1.1/login")
        assert result.score >= 25
        assert "IP address instead of domain" in result.flags


class TestTyposquatting:
    def test_detects_brand_mismatch(self):
        result = analyze_url("https://paypal-verify.tk/login")
        assert result.is_suspicious
        assert any("typosquatting" in f.lower() or "brand" in e.reason for e in result.evidence for f in result.flags)

    def test_real_domain_not_flagged(self):
        result = analyze_url("https://google.com")
        assert "possible typosquatting" not in result.flags


class TestSubdomains:
    def test_excessive_subdomains(self):
        result = analyze_url("https://a.b.c.d.e.example.com")
        assert "excessive subdomains" in result.flags


class TestHTTPS:
    def test_http_flagged(self):
        result = analyze_url("http://example.com/something")
        assert "no HTTPS" in result.flags

    def test_https_not_flagged(self):
        result = analyze_url("https://example.com")
        assert "no HTTPS" not in result.flags


class TestSuspiciousPaths:
    def test_login_path(self):
        result = analyze_url("https://suspicious-site.com/login")
        assert "suspicious path pattern" in result.flags

    def test_verify_path(self):
        result = analyze_url("https://suspicious-site.com/verify/account")
        assert "suspicious path pattern" in result.flags


class TestContextBoost:
    def test_banking_context_boosts_score(self):
        url = "https://secure-banking-login.tk/verify"
        result_default = analyze_url(url, "other")
        result_banking = analyze_url(url, "banking")
        assert result_banking.score >= result_default.score


class TestWWWPrefix:
    def test_www_prefix_works(self):
        result = analyze_url("www.suspicious-site.tk/login")
        assert result.domain  # Should parse correctly
        assert result.score > 0


class TestComplexURLs:
    def test_full_phishing_url(self):
        result = analyze_url("http://secure-bankofamerica-login.tk/verify-account")
        assert result.is_suspicious
        assert result.score >= 30
        assert len(result.flags) >= 2

    def test_safe_url(self):
        result = analyze_url("https://github.com/user/repo")
        assert result.score < 20
