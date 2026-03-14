"""Tests for URL scanner service."""

import pytest
from src.services.url_scanner import _extract_signals


class TestSuspiciousTLDs:
    def test_detects_tk_tld(self):
        signals = _extract_signals("https://example.tk/login")
        assert signals.get("suspicious_tld") == ".tk"
        assert signals["risk_score"] > 0

    def test_detects_xyz_tld(self):
        signals = _extract_signals("https://example.xyz/verify")
        assert signals.get("suspicious_tld") == ".xyz"

    def test_safe_tld_no_flag(self):
        signals = _extract_signals("https://example.com")
        assert "suspicious_tld" not in signals


class TestIPBasedURLs:
    def test_detects_ip_url(self):
        signals = _extract_signals("https://192.168.1.1/login")
        assert signals.get("ip_based_url") is True


class TestBrandImpersonation:
    def test_detects_amazon_impersonation(self):
        signals = _extract_signals("https://amazon-secure-verify.tk/login")
        assert signals.get("brand_impersonation") == "amazon"

    def test_real_amazon_not_flagged(self):
        signals = _extract_signals("https://amazon.com/orders")
        assert "brand_impersonation" not in signals


class TestSubdomains:
    def test_excessive_subdomains(self):
        signals = _extract_signals("https://a.b.c.d.example.com")
        assert signals.get("excessive_subdomains", 0) > 3


class TestHTTPS:
    def test_http_flagged(self):
        signals = _extract_signals("http://example.com")
        assert signals.get("no_https") is True

    def test_https_not_flagged(self):
        signals = _extract_signals("https://example.com")
        assert "no_https" not in signals


class TestSuspiciousPaths:
    def test_login_path(self):
        signals = _extract_signals("https://example.com/login")
        assert "login" in signals.get("suspicious_path", [])

    def test_verify_path(self):
        signals = _extract_signals("https://example.com/verify-account")
        assert "verify" in signals.get("suspicious_path", [])


class TestWWWPrefix:
    def test_www_prefix_works(self):
        signals = _extract_signals("www.example.com/test")
        assert "domain" in signals


class TestComplexURLs:
    def test_full_phishing_url(self):
        signals = _extract_signals("http://amaz0n-secure.verify-account.ru/login?ref=phish")
        assert signals["risk_score"] >= 50

    def test_safe_url(self):
        signals = _extract_signals("https://www.google.com/search?q=test")
        assert signals["risk_score"] <= 20
