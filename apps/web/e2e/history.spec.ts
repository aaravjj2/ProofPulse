import { test, expect } from "@playwright/test";
import { MOCK_HISTORY_RESPONSE, MOCK_EMPTY_HISTORY } from "./helpers/mock-responses";

test.describe("History Page", () => {
  test("shows empty state when no analyses", async ({ page }) => {
    await page.route("**/api/v1/history**", (route) => {
      if (route.request().url().includes("/stats")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ total_analyses: 0, avg_risk_score: 0, scam_rate_pct: 0, analyses_by_day: {} }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_EMPTY_HISTORY),
      });
    });
    await page.goto("/history");
    await expect(page.getByTestId("history-empty-state")).toBeVisible();
    await expect(page.getByText(/no analyses yet/i)).toBeVisible();
  });

  test("shows history items", async ({ page }) => {
    await page.route("**/api/v1/history**", (route) => {
      if (route.request().url().includes("/stats")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ total_analyses: 4, avg_risk_score: 50, scam_rate_pct: 30, analyses_by_day: {} }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HISTORY_RESPONSE),
      });
    });
    await page.goto("/history");
    await expect(page.getByTestId("history-card")).toHaveCount(4);
  });

  test("history cards show risk level and verdict", async ({ page }) => {
    await page.route("**/api/v1/history**", (route) => {
      if (route.request().url().includes("/stats")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ total_analyses: 4, avg_risk_score: 50, scam_rate_pct: 30, analyses_by_day: {} }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HISTORY_RESPONSE),
      });
    });
    await page.goto("/history");
    const firstCard = page.getByTestId("history-card").first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toContainText("CRITICAL");
  });

  test("empty state has link to analyze page", async ({ page }) => {
    await page.route("**/api/v1/history**", (route) => {
      if (route.request().url().includes("/stats")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ total_analyses: 0, avg_risk_score: 0, scam_rate_pct: 0, analyses_by_day: {} }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_EMPTY_HISTORY),
      });
    });
    await page.goto("/history");
    const analyzeLink = page.getByRole("link", { name: /analyze something/i });
    await expect(analyzeLink).toBeVisible();
  });

  test("error state on API failure", async ({ page }) => {
    await page.route("**/api/v1/history**", (route) => route.abort("failed"));
    await page.goto("/history");
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
  });
});
