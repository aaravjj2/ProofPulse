import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ProofPulse/);
  });

  test("homepage has hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "ProofPulse", exact: true })).toBeVisible();
    await expect(page.getByText("Verify before you trust")).toBeVisible();
  });

  test("navbar has all required links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /analyze/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /history/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /about/i })).toBeVisible();
  });

  test("navigate to analyze page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /analyze/i }).click();
    await expect(page).toHaveURL(/\/analyze/);
    await expect(page.getByText("Analyze Content")).toBeVisible();
  });

  test("navigate to history page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /history/i }).click();
    await expect(page).toHaveURL(/\/history/);
  });

  test("navigate to about page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /about/i }).click();
    await expect(page).toHaveURL(/\/about/);
  });

  test("CTA button navigates to analyze", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /check a message/i }).click();
    await expect(page).toHaveURL(/\/analyze/);
  });
});
