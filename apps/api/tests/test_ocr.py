"""Tests for OCR service."""

import pytest
from apps.api.src.services.ocr.extractor import clean_ocr_text


class TestCleanOCRText:
    def test_removes_extra_whitespace(self):
        assert clean_ocr_text("hello   world") == "hello world"

    def test_removes_ocr_artifacts(self):
        assert clean_ocr_text("hello|world}test") == "helloworldtest"

    def test_normalizes_quotes(self):
        result = clean_ocr_text("\u201cHello\u201d \u2018World\u2019")
        assert '"Hello"' in result
        assert "'World'" in result

    def test_strips_edges(self):
        assert clean_ocr_text("  hello  ") == "hello"

    def test_handles_empty_string(self):
        assert clean_ocr_text("") == ""

    def test_handles_multiline(self):
        result = clean_ocr_text("line1\n\n  line2\t\tline3")
        assert result == "line1 line2 line3"
