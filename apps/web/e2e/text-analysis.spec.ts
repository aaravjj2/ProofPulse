import { test, expect } from "@playwright/test";
import { AnalyzerPage } from "./helpers/AnalyzerPage";
import { mockAnalyzeAPI } from "./helpers/mocks";
import {
  MOCK_CRITICAL,
  MOCK_SAFE,
  MOCK_HIGH,
} from "./helpers/mock-responses";

test.describe("Text Analysis", () => {
  test("analyze button disabled when textarea empty", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await expect(analyzer.analyzeButton).toBeDisabled();
  });

  test("analyze button enabled after typing", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.textarea.fill("Test message");
    await expect(analyzer.analyzeButton).toBeEnabled();
  });

  test("character counter updates", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.textarea.fill("Hello world");
    await expect(analyzer.charCounter).toContainText("11");
  });

  test("clear button resets textarea", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.textarea.waitFor({ state: "visible" });
    await analyzer.textarea.click();
    await analyzer.textarea.fill("test message");
    await expect(analyzer.charCounter).toContainText("12");
    await analyzer.clearButton.click();
    await expect(analyzer.textarea).toHaveValue("");
    await expect(analyzer.analyzeButton).toBeDisabled();
  });

  test("full text analysis flow — CRITICAL result", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CRITICAL),
      }),
    );
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText(
      "URGENT: IRS FINAL NOTICE — you owe $3,847. Wire transfer required within 24 hours or face ARREST.",
    );

    await expect(analyzer.resultCard).toBeVisible({ timeout: 15000 });
    await expect(analyzer.riskBadge).toContainText("Critical Risk");
    await expect(analyzer.verdictText).toBeVisible();
    await expect(analyzer.evidenceSection).toBeVisible();
  });

  test("full text analysis flow — SAFE result", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SAFE),
      }),
    );
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Hey, want to grab lunch tomorrow?");

    await expect(analyzer.riskBadge).toContainText("Safe");
  });

  test("loading state appears during analysis", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH),
      });
    });
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.textarea.fill("Suspicious message");
    await analyzer.analyzeButton.click();
    await expect(analyzer.loadingSpinner).toBeVisible();
  });

  test("feedback widget visible after analysis", async ({ page }) => {
    await mockAnalyzeAPI(page);
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Test phishing message");
    await expect(analyzer.feedbackWidget).toBeVisible();
  });

  test("copy report button works", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CRITICAL),
      }),
    );
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Scam message test");
    await expect(analyzer.copyReportButton).toBeVisible();
    await analyzer.copyReportButton.click();
    await expect(analyzer.copyReportButton).toContainText("Copied!");
  });

  test("analyze another button resets view", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SAFE),
      }),
    );
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Safe message test");
    await expect(analyzer.analyzeAnotherButton).toBeVisible();
    await analyzer.analyzeAnotherButton.click();
    await expect(analyzer.resultCard).not.toBeVisible();
  });

  test("evidence section shows correct number of items", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CRITICAL),
      }),
    );
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Scam content");
    await expect(analyzer.evidenceSection).toBeVisible();
    // MOCK_CRITICAL has 4 evidence items
    await expect(
      analyzer.evidenceSection.getByRole("listitem"),
    ).toHaveCount(4);
  });

  test("HIGH result shows correct badge", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH),
      }),
    );
    const analyzer = new AnalyzerPage(page);
    await analyzer.goto();
    await analyzer.analyzeText("Suspicious message");
    await expect(analyzer.riskBadge).toContainText("High Risk");
  });

  test("error state on API failure", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) => route.abort("failed"));
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.textarea.fill("test message");
    await analyzer.analyzeButton.click();
    await expect(page.getByRole("alert").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("rate limit shows appropriate message", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ message: "Too many requests" }),
      }),
    );
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.textarea.fill("test message");
    await analyzer.analyzeButton.click();
    await expect(page.getByText(/too many requests/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("server error shows error alert", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal server error" }),
      }),
    );
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.textarea.fill("test message");
    await analyzer.analyzeButton.click();
    await expect(page.getByRole("alert").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("text tab is selected by default", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await expect(analyzer.textTab).toHaveAttribute("data-state", "active");
  });

  test("tabs switch input modes", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.urlTab.click();
    await expect(analyzer.urlInput).toBeVisible();
    await analyzer.imageTab.click();
    await expect(analyzer.fileDropzone).toBeVisible();
    await analyzer.textTab.click();
    await expect(analyzer.textarea).toBeVisible();
  });
});
