"""Tests for the heuristic detection service."""

import pytest
from apps.api.src.services.heuristics.detector import analyze_text_heuristics


class TestUrgencyDetection:
    def test_detects_urgent_language(self):
        text = "URGENT: Your account has been locked. Verify immediately!"
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("urgent" in f.lower() for f in result.flags)

    def test_detects_verify_demand(self):
        text = "Please verify your identity now to restore access."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("verif" in f.lower() for f in result.flags)

    def test_detects_account_threat(self):
        text = "Your account has been suspended due to suspicious activity."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("account" in f.lower() for f in result.flags)

    def test_detects_click_bait(self):
        text = "Click here to confirm your account details."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("click" in f.lower() for f in result.flags)

    def test_detects_scarcity_pressure(self):
        text = "This is your final warning! Limited time offer expires today."
        result = analyze_text_heuristics(text)
        assert result.score > 0


class TestCredentialDetection:
    def test_detects_password_request(self):
        text = "Enter your password to continue."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("credential" in f.lower() for f in result.flags)

    def test_detects_financial_data_request(self):
        text = "Please provide your credit card number and CVV."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("financial" in f.lower() for f in result.flags)

    def test_detects_unusual_payment(self):
        text = "Send payment via wire transfer or bitcoin."
        result = analyze_text_heuristics(text)
        assert result.score > 0


class TestJobScamDetection:
    def test_detects_no_experience_offer(self):
        text = "No experience needed! Work from home and earn $50/hour."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert result.category_hint == "job_scam"

    def test_detects_upfront_fee(self):
        text = "Pay the $99 training fee to start your new career today."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("upfront" in f.lower() or "fee" in f.lower() for f in result.flags)

    def test_detects_instant_hire(self):
        text = "You have been hired immediately! Start today."
        result = analyze_text_heuristics(text)
        assert result.score > 0


class TestPaymentScamDetection:
    def test_detects_fake_payment_status(self):
        text = "Your payment is pending. Click to verify the transaction."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert result.category_hint in ("payment_scam", "phishing")

    def test_detects_gift_card_request(self):
        text = "Purchase 5 Google Play gift cards and send me the codes."
        result = analyze_text_heuristics(text)
        assert result.score > 0

    def test_detects_refund_scam(self):
        text = "You are eligible for a refund of $500. Verify now."
        result = analyze_text_heuristics(text)
        assert result.score > 0


class TestImpersonationDetection:
    def test_detects_authority_impersonation(self):
        text = "Official notice from the IRS regarding your tax return."
        result = analyze_text_heuristics(text)
        assert result.score > 0
        assert any("authority" in f.lower() or "impersonation" in f.lower() for f in result.flags)

    def test_detects_support_impersonation(self):
        text = "This is the Microsoft tech support team calling about your computer."
        result = analyze_text_heuristics(text)
        assert result.score > 0


class TestSafeMessages:
    def test_safe_message_low_score(self):
        text = "Hi, just wanted to check how you're doing. Let me know if you'd like to grab lunch this week!"
        result = analyze_text_heuristics(text)
        assert result.score < 20
        assert result.category_hint == "safe"

    def test_unsubscribe_reduces_score(self):
        text = "Here's your weekly newsletter. To unsubscribe, click the link below."
        result = analyze_text_heuristics(text)
        assert result.score < 15


class TestFormattingDetection:
    def test_excessive_exclamation(self):
        text = "ACT NOW!!!! Don't miss this!!!!"
        result = analyze_text_heuristics(text)
        assert any("exclamation" in f.lower() for f in result.flags)

    def test_excessive_caps(self):
        text = "SEND YOUR INFO IMMEDIATELY or FACE CONSEQUENCES TODAY"
        result = analyze_text_heuristics(text)
        assert any("capital" in f.lower() for f in result.flags)


class TestCombinedPhishing:
    def test_full_phishing_message_high_score(self):
        text = (
            "URGENT: Your Chase bank account has been locked. "
            "Verify your identity immediately. Click here: "
            "https://secure-chase-verify.tk/login. "
            "Your password must be confirmed within 24 hours."
        )
        result = analyze_text_heuristics(text)
        assert result.score >= 40
        assert len(result.flags) >= 3
        assert len(result.evidence) >= 3

    def test_score_capped_at_100(self):
        text = (
            "URGENT! VERIFY NOW! Your account is locked! "
            "Click here immediately! Final warning! "
            "Enter your password, SSN, credit card number. "
            "Wire transfer required. You were hired immediately! "
            "Pay training fee. Official IRS notice!"
        )
        result = analyze_text_heuristics(text)
        assert result.score <= 100
