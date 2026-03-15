import { test, expect } from "@playwright/test";

test.describe("Responsive Design", () => {
  test("mobile viewport shows navbar", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByTestId("navbar")).toBeVisible();
  });

  test("tablet viewport shows analyze page correctly", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/analyze");
    await expect(page.getByTestId("text-input")).toBeVisible();
    await expect(page.getByTestId("analyze-button")).toBeVisible();
  });

  test("mobile viewport analyze page is usable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/analyze");
    await expect(page.getByTestId("tab-text")).toBeVisible();
    await expect(page.getByTestId("text-input")).toBeVisible();
    await expect(page.getByTestId("analyze-button")).toBeVisible();
  });

  test("desktop viewport shows full layout", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByTestId("navbar")).toBeVisible();
    await expect(page.getByRole("heading", { name: "ProofPulse", exact: true })).toBeVisible();
    await expect(page.getByText("How It Works")).toBeVisible();
  });
});
