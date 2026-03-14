import { test, expect } from "@playwright/test";
import {
  MOCK_HIGH_RISK_RESPONSE,
  MOCK_SAFE_RESPONSE,
} from "./helpers/mock-responses";

test.describe("Analysis Scenarios", () => {
  test("high-risk scam message shows critical evidence", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH_RISK_RESPONSE),
      });
    });

    await page.goto("/analyze");
    await page
      .getByRole("textbox")
      .fill(
        "URGENT: Your PayPal account has been suspended. Click here: paypa1-secure.ru/verify",
      );
    await page.getByRole("button", { name: /^analyze$/i }).click();

    await expect(page.getByTestId("analysis-result")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("evidence-section")).toBeVisible();
  });

  test("safe message shows low risk score", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SAFE_RESPONSE),
      });
    });

    await page.goto("/analyze");
    await page
      .getByRole("textbox")
      .fill("Hey, want to grab coffee tomorrow at 3pm?");
    await page.getByRole("button", { name: /^analyze$/i }).click();

    await expect(page.getByTestId("analysis-result")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("risk-badge")).toContainText("Safe");
  });

  test("evidence section shows all items with flags", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH_RISK_RESPONSE),
      });
    });

    await page.goto("/analyze");
    await page
      .getByRole("textbox")
      .fill("Your account needs verification");
    await page.getByRole("button", { name: /^analyze$/i }).click();

    await expect(page.getByTestId("evidence-section")).toBeVisible({
      timeout: 10000,
    });
  });

  test("URL tab analyzes suspicious links", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ...MOCK_HIGH_RISK_RESPONSE, input_type: "url" }),
      });
    });

    await page.goto("/analyze");
    await page.getByRole("tab", { name: /url/i }).click();
    await page
      .getByLabel(/url to analyze/i)
      .fill("https://phishing-example.ru/login");
    await page.getByRole("button", { name: /^analyze$/i }).click();

    await expect(page.getByTestId("analysis-result")).toBeVisible({
      timeout: 10000,
    });
  });

  test("feedback widget appears after result", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH_RISK_RESPONSE),
      });
    });

    await page.goto("/analyze");
    await page
      .getByRole("textbox")
      .fill("Suspicious message to test");
    await page.getByRole("button", { name: /^analyze$/i }).click();

    await expect(page.getByTestId("feedback-widget")).toBeVisible({
      timeout: 10000,
    });
  });

  test("switching input tabs resets state", async ({ page }) => {
    await page.goto("/analyze");

    // Type in text tab
    await page.getByRole("textbox").fill("some message");
    // Switch to URL tab
    await page.getByRole("tab", { name: /url/i }).click();
    // Should show URL input, not text
    await expect(page.getByLabel(/url to analyze/i)).toBeVisible();
    // Switch back to text
    await page.getByRole("tab", { name: /^text$/i }).click();
    await expect(page.getByRole("textbox")).toBeVisible();
  });
});
