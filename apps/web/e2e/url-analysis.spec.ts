import { test, expect } from "@playwright/test";
import { mockAnalyzeAPI, MOCK_RESPONSE } from "./helpers/mocks";
import { AnalyzerPage } from "./helpers/AnalyzerPage";

test.describe("URL Analysis", () => {
  test("URL tab switches input mode", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByRole("tab", { name: /url/i }).click();
    await expect(page.getByPlaceholder(/https/i)).toBeVisible();
  });

  test("full URL analysis flow", async ({ page }) => {
    await mockAnalyzeAPI(page, {
      ...MOCK_RESPONSE,
      input_type: "url",
      risk_score: 92,
      risk_level: "CRITICAL",
    });

    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeURL("https://phishing-site.tk/login");

    await expect(analyzer.resultCard).toBeVisible();
    await expect(analyzer.riskBadge).toContainText("Critical Risk");
  });
});
