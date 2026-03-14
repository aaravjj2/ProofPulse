import { test, expect } from "@playwright/test";

test.describe("Error States", () => {
  test("shows error when API is down", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.abort("failed"),
    );

    await page.goto("/analyze");
    await page.getByRole("textbox").fill("test message");
    await page.getByRole("button", { name: /analyze/i }).click();

    await expect(page.getByRole("alert").first()).toBeVisible({ timeout: 10000 });
  });

  test("shows rate limit message on 429", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ message: "Too many requests" }),
      }),
    );

    await page.goto("/analyze");
    await page.getByRole("textbox").fill("test message");
    await page.getByRole("button", { name: /analyze/i }).click();

    await expect(page.getByText(/too many requests/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows error for server error", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal server error" }),
      }),
    );

    await page.goto("/analyze");
    await page.getByRole("textbox").fill("test message");
    await page.getByRole("button", { name: /analyze/i }).click();

    await expect(page.getByRole("alert").first()).toBeVisible({ timeout: 10000 });
  });
});
