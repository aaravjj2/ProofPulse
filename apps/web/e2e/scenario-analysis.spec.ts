import { test, expect } from "@playwright/test";
import {
  MOCK_HIGH,
  MOCK_SAFE,
} from "./helpers/mock-responses";

test.describe("Analysis Scenarios", () => {
  test("high-risk scam message shows critical evidence", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH),
      }),
    );
    await page.goto("/analyze");
    await page.getByTestId("text-input").fill(
      "URGENT: Your PayPal account has been suspended. Click here: paypa1-secure.ru/verify",
    );
    await page.getByTestId("analyze-button").click();
    await expect(page.getByTestId("analysis-result")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("evidence-section")).toBeVisible();
  });

  test("safe message shows low risk score", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SAFE),
      }),
    );
    await page.goto("/analyze");
    await page.getByTestId("text-input").fill("Hey, want to grab coffee tomorrow at 3pm?");
    await page.getByTestId("analyze-button").click();
    await expect(page.getByTestId("analysis-result")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("risk-badge")).toContainText("Safe");
  });

  test("evidence section shows all items", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH),
      }),
    );
    await page.goto("/analyze");
    await page.getByTestId("text-input").fill("Your account needs verification");
    await page.getByTestId("analyze-button").click();
    await expect(page.getByTestId("evidence-section")).toBeVisible({ timeout: 15000 });
  });

  test("feedback widget appears after result", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH),
      }),
    );
    await page.goto("/analyze");
    await page.getByTestId("text-input").fill("Suspicious message to test");
    await page.getByTestId("analyze-button").click();
    await expect(page.getByTestId("feedback-widget")).toBeVisible({ timeout: 15000 });
  });

  test("switching input tabs preserves UI state", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByTestId("text-input").fill("some message");
    await page.getByTestId("tab-url").click();
    await expect(page.getByTestId("url-input")).toBeVisible();
    await page.getByTestId("tab-text").click();
    await expect(page.getByTestId("text-input")).toBeVisible();
  });
});
