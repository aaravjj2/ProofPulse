import { test, expect } from "@playwright/test";
import { MOCK_HIGH } from "./helpers/mock-responses";

test.describe("Feedback Widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH),
      }),
    );
    await page.route("**/api/v1/feedback", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ feedback_id: "fb-1", status: "ok" }),
      }),
    );

    await page.goto("/analyze");
    const textarea = page.getByTestId("text-input");
    await textarea.waitFor({ state: "visible" });
    await textarea.click();
    await textarea.fill("Test phishing message");
    await expect(page.getByTestId("analyze-button")).toBeEnabled({ timeout: 5000 });
    await page.getByTestId("analyze-button").click();
    await page.getByTestId("analysis-result").waitFor({ timeout: 15000 });
  });

  test("feedback widget is visible after analysis", async ({ page }) => {
    await expect(page.getByTestId("feedback-widget")).toBeVisible();
  });

  test("star rating is interactive", async ({ page }) => {
    const star3 = page.getByTestId("feedback-star-3");
    await star3.click();
    await expect(star3).toHaveAttribute("aria-checked", "true");
  });

  test("submit button appears after rating", async ({ page }) => {
    await page.getByTestId("feedback-star-4").click();
    await expect(page.getByTestId("feedback-submit")).toBeVisible();
  });

  test("submitting feedback shows success message", async ({ page }) => {
    await page.getByTestId("feedback-star-5").click();
    await page.getByTestId("feedback-submit").click();
    await expect(page.getByTestId("feedback-success")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("feedback-success")).toContainText("Thank you");
  });
});
