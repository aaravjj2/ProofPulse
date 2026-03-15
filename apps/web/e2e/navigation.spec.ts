import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ProofPulse/);
  });

  test("homepage has hero section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "ProofPulse", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Verify before you trust")).toBeVisible();
  });

  test("navbar is visible with all links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar")).toBeVisible();
    await expect(page.getByTestId("nav-link-analyze")).toBeVisible();
    await expect(page.getByTestId("nav-link-history")).toBeVisible();
    await expect(page.getByTestId("nav-link-about")).toBeVisible();
  });

  test("navigate to analyze page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-link-analyze").click();
    await expect(page).toHaveURL(/\/analyze/);
    await expect(page.getByText("Analyze Content")).toBeVisible();
  });

  test("navigate to history page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-link-history").click();
    await expect(page).toHaveURL(/\/history/);
  });

  test("navigate to about page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-link-about").click();
    await expect(page).toHaveURL(/\/about/);
  });

  test("CTA button navigates to analyze", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /check a message/i }).click();
    await expect(page).toHaveURL(/\/analyze/);
  });

  test("theme toggle switches mode", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toBeVisible();
    await toggle.click();
    // Verify the html element has the dark class toggled
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    // Toggle back
    await toggle.click();
    const hasDark2 = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(hasDark).not.toBe(hasDark2);
  });

  test("footer shows disclaimer text", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/AI may make mistakes/)).toBeVisible();
  });

  test("logo navigates to home", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByRole("link", { name: /proofpulse home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("How It Works section is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("How It Works")).toBeVisible();
  });
});
