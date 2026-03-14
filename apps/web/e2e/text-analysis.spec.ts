import { test, expect } from "@playwright/test";
import { AnalyzerPage } from "./helpers/AnalyzerPage";
import { mockAnalyzeAPI, MOCK_RESPONSE, MOCK_SAFE_RESPONSE } from "./helpers/mocks";

test.describe("Text Analysis", () => {
  test("analyze button disabled when textarea empty", async ({ page }) => {
    await page.goto("/analyze");
    const btn = page.getByRole("button", { name: /analyze/i });
    await expect(btn).toBeDisabled();
  });

  test("analyze button enabled after typing", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByRole("textbox").fill("Test message");
    const btn = page.getByRole("button", { name: /analyze/i });
    await expect(btn).toBeEnabled();
  });

  test("character counter updates", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByRole("textbox").fill("Hello world");
    const counter = page.getByTestId("char-counter");
    await expect(counter).toContainText("11");
  });

  test("clear button resets textarea", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByRole("textbox").fill("test message");
    await page.getByRole("button", { name: /clear/i }).click();
    await expect(page.getByRole("textbox")).toHaveValue("");
    await expect(page.getByRole("button", { name: /analyze/i })).toBeDisabled();
  });

  test("full text analysis flow with mocked API", async ({ page }) => {
    await mockAnalyzeAPI(page);
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();

    await analyzer.analyzeText(
      "You have won $1,000,000! Click here to claim now.",
    );

    await expect(analyzer.resultCard).toBeVisible({ timeout: 10000 });
    await expect(analyzer.riskBadge).toContainText("HIGH");
    await expect(analyzer.verdictText).toBeVisible();
    await expect(analyzer.evidenceSection).toBeVisible();
  });

  test("loading state appears during analysis", async ({ page }) => {
    // Delay the API response to see loading state
    await page.route("**/api/v1/analyze/**", async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_RESPONSE),
      });
    });

    await page.goto("/analyze");
    await page.getByRole("textbox").fill("Suspicious message");
    await page.getByRole("button", { name: /analyze/i }).click();

    await expect(page.getByTestId("loading-state")).toBeVisible();
  });

  test("safe result shows SAFE badge", async ({ page }) => {
    await mockAnalyzeAPI(page, MOCK_SAFE_RESPONSE);
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Hey, want to grab lunch tomorrow?");

    await expect(analyzer.riskBadge).toContainText("SAFE");
  });

  test("feedback widget visible after analysis", async ({ page }) => {
    await mockAnalyzeAPI(page);
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Test phishing message");

    await expect(analyzer.feedbackWidget).toBeVisible();
  });
});
