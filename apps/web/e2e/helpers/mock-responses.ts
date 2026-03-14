export const MOCK_HIGH_RISK_RESPONSE = {
  analysis_id: "test-high-risk-123",
  risk_score: 87,
  risk_level: "HIGH",
  verdict:
    "This appears to be a phishing attempt designed to steal your credentials.",
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

export const MOCK_CRITICAL_RESPONSE = {
  ...MOCK_HIGH_RISK_RESPONSE,
  analysis_id: "test-critical-456",
  risk_score: 96,
  risk_level: "CRITICAL",
  verdict: "This is a confirmed financial fraud attempt. Do not engage.",
  confidence: 0.99,
};

export const MOCK_SAFE_RESPONSE = {
  analysis_id: "test-safe-789",
  risk_score: 4,
  risk_level: "SAFE",
  verdict:
    "This appears to be a legitimate message with no suspicious signals.",
  evidence: [
    {
      label: "No financial request",
      value:
        "Message contains no requests for payment or credentials",
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

export const MOCK_HISTORY_ITEMS = [
  {
    analysis_id: "test-1",
    created_at: new Date().toISOString(),
    input_type: "text",
    risk_level: "HIGH",
    risk_score: 87,
    verdict: "Phishing attempt detected.",
  },
  {
    analysis_id: "test-2",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    input_type: "url",
    risk_level: "CRITICAL",
    risk_score: 95,
    verdict: "Confirmed malicious URL.",
  },
  {
    analysis_id: "test-3",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    input_type: "text",
    risk_level: "SAFE",
    risk_score: 3,
    verdict: "Legitimate message.",
  },
];

export const MOCK_HISTORY_RESPONSE = {
  items: MOCK_HISTORY_ITEMS,
  total: 3,
  page: 1,
  per_page: 20,
};
