import { Page } from "@playwright/test";

export const MOCK_RESPONSE = {
  analysis_id: "test-123",
  risk_score: 87,
  risk_level: "HIGH",
  verdict: "This is a phishing attempt designed to steal your credentials.",
  evidence: [
    {
      label: "Suspicious domain",
      value: "amaz0n-verify.ru uses a foreign TLD",
      weight: 0.9,
      flag: "red",
    },
    {
      label: "Urgency language",
      value: "Demands immediate action within 24 hours",
      weight: 0.8,
      flag: "red",
    },
    {
      label: "No unsubscribe option",
      value: "Legitimate services always include unsubscribe",
      weight: 0.3,
      flag: "yellow",
    },
  ],
  recommendations: [
    "Do not click any links in this message",
    "Report as phishing to your email provider",
  ],
  next_steps: ["Delete the message", "Block the sender"],
  confidence: 0.95,
  model_used: "gpt-4o",
  latency_ms: 1243,
  input_type: "text",
};

export const MOCK_SAFE_RESPONSE = {
  analysis_id: "test-safe",
  risk_score: 5,
  risk_level: "SAFE",
  verdict: "This appears to be a normal message with no suspicious signals.",
  evidence: [
    {
      label: "No financial request",
      value: "No requests for payment or personal data",
      weight: 0.2,
      flag: "green",
    },
  ],
  recommendations: ["No action required"],
  next_steps: ["Reply normally"],
  confidence: 0.98,
  model_used: "gpt-4o",
  latency_ms: 800,
  input_type: "text",
};

export async function mockAnalyzeAPI(page: Page, response = MOCK_RESPONSE) {
  await page.route("**/api/v1/analyze/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

export async function mockHistoryAPI(
  page: Page,
  items: unknown[] = [],
  total = 0,
) {
  await page.route("**/api/v1/history**", async (route) => {
    // Don't intercept stats
    if (route.request().url().includes("/stats")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          total_analyses: total,
          avg_risk_score: 50,
          scam_rate_pct: 30,
          analyses_by_day: {},
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items, total, page: 1, per_page: 20 }),
    });
  });
}
