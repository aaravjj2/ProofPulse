import { test, expect } from "@playwright/test";
import { AnalyzerPage } from "./helpers/AnalyzerPage";
import { MOCK_URL_HIGH, MOCK_CRITICAL } from "./helpers/mock-responses";

test.describe("URL Analysis", () => {
  test("URL tab switches input mode", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.urlTab.click();
    await expect(analyzer.urlInput).toBeVisible();
  });

  test("URL input accepts a URL", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.urlTab.click();
    await analyzer.urlInput.fill("https://example.com");
    await expect(analyzer.urlInput).toHaveValue("https://example.com");
  });

  test("analyze button enabled after URL entry", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.urlTab.click();
    await analyzer.urlInput.fill("https://suspicious.ru/login");
    await expect(analyzer.analyzeButton).toBeEnabled();
  });

  test("analyze button disabled when URL empty", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.urlTab.click();
    await expect(analyzer.analyzeButton).toBeDisabled();
  });

  test("full URL analysis flow", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_URL_HIGH),
      }),
    );

    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeURL("https://amaz0n-account-verify.ru/login");

    await expect(analyzer.resultCard).toBeVisible({ timeout: 15000 });
    await expect(analyzer.riskBadge).toContainText("High Risk");
  });

  test("URL analysis shows verdict and evidence", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_URL_HIGH),
      }),
    );

    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeURL("https://phishing-site.tk/login");

    await expect(analyzer.verdictText).toContainText("phishing");
    await expect(analyzer.evidenceSection).toBeVisible();
  });

  test("Enter key submits URL analysis", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CRITICAL),
      }),
    );

    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.urlTab.click();
    await analyzer.urlInput.fill("https://phishing.example.com");
    await analyzer.urlInput.press("Enter");
    await expect(analyzer.resultCard).toBeVisible({ timeout: 15000 });
  });
});
