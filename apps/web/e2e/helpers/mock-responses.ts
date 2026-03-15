import type { AnalysisResponse, HistoryResponse, StatsResponse } from "../../lib/types";

export const MOCK_CRITICAL: AnalysisResponse = {
  analysis_id: "test-critical-456",
  risk_score: 96,
  risk_level: "CRITICAL",
  verdict: "This is a confirmed financial fraud attempt. Do not engage.",
  evidence: [
    {
      label: "Artificial urgency with threat of arrest",
      value: "\"Failure to pay via wire transfer within 24 hours will result in ARREST\" — the IRS never threatens arrest via text/email.",
      weight: 0.9,
      flag: "red",
    },
    {
      label: "Suspicious domain: irs-tax-payments.xyz",
      value: "The .xyz TLD is not used by any US government agency. The real IRS website is irs.gov.",
      weight: 0.95,
      flag: "red",
    },
    {
      label: "Wire transfer demand",
      value: "Legitimate government agencies never demand payment by wire transfer, gift card, or cryptocurrency.",
      weight: 0.85,
      flag: "red",
    },
    {
      label: "Specific dollar amount creates false credibility",
      value: "\"$3,847 in back taxes\" — scammers use exact figures to appear legitimate.",
      weight: 0.6,
      flag: "yellow",
    },
  ],
  recommendations: [
    "Do not click any links or call numbers.",
    "Call the IRS directly: 1-800-829-1040.",
    "Report to phishing@irs.gov.",
  ],
  next_steps: [
    "Block the sender immediately.",
    "Report the message to your phone carrier.",
    "Monitor your accounts for suspicious activity.",
  ],
  confidence: 0.99,
  model_used: "gpt-4o",
  latency_ms: 820,
  input_type: "text",
};

export const MOCK_HIGH: AnalysisResponse = {
  analysis_id: "test-high-risk-123",
  risk_score: 87,
  risk_level: "HIGH",
  verdict: "This appears to be a phishing attempt designed to steal your credentials.",
  evidence: [
    {
      label: "Suspicious domain",
      value: "amaz0n-verify.ru uses number substitution and foreign TLD",
      weight: 0.92,
      flag: "red",
    },
    {
      label: "Artificial urgency",
      value: "24-hour deadline with threat of account deletion",
      weight: 0.85,
      flag: "red",
    },
    {
      label: "No legitimate contact method",
      value: "No official company contact information provided",
      weight: 0.6,
      flag: "yellow",
    },
  ],
  recommendations: [
    "Do not click any links in this message",
    "Log in directly to the official website to check your account",
  ],
  next_steps: ["Report as phishing", "Block the sender", "Delete the message"],
  confidence: 0.95,
  model_used: "gpt-4o",
  latency_ms: 1243,
  input_type: "text",
};

export const MOCK_SAFE: AnalysisResponse = {
  analysis_id: "test-safe-789",
  risk_score: 4,
  risk_level: "SAFE",
  verdict: "This appears to be a legitimate message with no suspicious signals.",
  evidence: [
    {
      label: "No financial request",
      value: "Message contains no requests for payment or credentials",
      weight: 0.2,
      flag: "green",
    },
    {
      label: "Legitimate context",
      value: "References a real shared event in a credible way",
      weight: 0.15,
      flag: "green",
    },
  ],
  recommendations: ["No action required"],
  next_steps: ["Reply normally"],
  confidence: 0.98,
  model_used: "gpt-4o",
  latency_ms: 890,
  input_type: "text",
};

export const MOCK_URL_HIGH: AnalysisResponse = {
  analysis_id: "test-url-high-001",
  risk_score: 88,
  risk_level: "HIGH",
  verdict: "This URL shows multiple phishing indicators.",
  evidence: [
    {
      label: "Homoglyph attack",
      value: "\"amaz0n\" uses zero instead of the letter O to spoof Amazon's domain.",
      weight: 0.95,
      flag: "red",
    },
    {
      label: "Foreign TLD (.ru)",
      value: "Amazon's real domain is amazon.com. The .ru TLD indicates a spoofed site.",
      weight: 0.9,
      flag: "red",
    },
  ],
  recommendations: ["Do not visit this URL.", "Go directly to amazon.com if needed."],
  next_steps: ["Report the URL to your browser vendor."],
  confidence: 0.91,
  model_used: "gpt-4o",
  latency_ms: 650,
  input_type: "url",
};

export const MOCK_IMAGE_HIGH: AnalysisResponse = {
  analysis_id: "test-image-high-001",
  risk_score: 78,
  risk_level: "HIGH",
  verdict: "This screenshot contains a fake prize notification scam.",
  evidence: [
    {
      label: "Fake prize claim",
      value: "You've been selected as the winner — classic lottery scam pattern.",
      weight: 0.88,
      flag: "red",
    },
    {
      label: "Personal information request",
      value: "Requesting SSN, bank details under guise of 'prize collection'.",
      weight: 0.82,
      flag: "red",
    },
  ],
  recommendations: ["Do not share personal information.", "Report to FTC at reportfraud.ftc.gov."],
  next_steps: ["Delete the message.", "Block the sender."],
  confidence: 0.89,
  model_used: "gpt-4o",
  latency_ms: 1560,
  input_type: "image",
};

export const MOCK_HISTORY_RESPONSE: HistoryResponse = {
  items: [
    {
      analysis_id: "h1",
      created_at: new Date(Date.now() - 60_000).toISOString(),
      input_type: "text",
      risk_level: "CRITICAL",
      risk_score: 96,
      verdict: "This is a confirmed financial fraud attempt.",
    },
    {
      analysis_id: "h2",
      created_at: new Date(Date.now() - 120_000).toISOString(),
      input_type: "url",
      risk_level: "HIGH",
      risk_score: 88,
      verdict: "This URL shows multiple phishing indicators.",
    },
    {
      analysis_id: "h3",
      created_at: new Date(Date.now() - 180_000).toISOString(),
      input_type: "text",
      risk_level: "SAFE",
      risk_score: 3,
      verdict: "Legitimate message.",
    },
    {
      analysis_id: "h4",
      created_at: new Date(Date.now() - 240_000).toISOString(),
      input_type: "image",
      risk_level: "MEDIUM",
      risk_score: 45,
      verdict: "Suspicious prize notification screenshot.",
    },
  ],
  total: 4,
  page: 1,
  per_page: 20,
};

export const MOCK_EMPTY_HISTORY: HistoryResponse = {
  items: [],
  total: 0,
  page: 1,
  per_page: 20,
};

export const MOCK_STATS_RESPONSE: StatsResponse = {
  total_analyses: 127,
  avg_risk_score: 54.3,
  scam_rate_pct: 38.5,
  analyses_by_day: {
    "2026-03-10": 12,
    "2026-03-11": 18,
    "2026-03-12": 22,
    "2026-03-13": 37,
    "2026-03-14": 25,
    "2026-03-15": 13,
  },
};

// Legacy exports for backward compatibility with existing tests
export const MOCK_HIGH_RISK_RESPONSE = MOCK_HIGH;
export const MOCK_CRITICAL_RESPONSE = MOCK_CRITICAL;
export const MOCK_SAFE_RESPONSE = MOCK_SAFE;
export const MOCK_HISTORY_ITEMS = MOCK_HISTORY_RESPONSE.items;
