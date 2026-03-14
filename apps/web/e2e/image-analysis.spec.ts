import { test, expect } from "@playwright/test";

test.describe("Image Analysis", () => {
  test("Screenshot tab shows upload area", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByRole("tab", { name: /screenshot/i }).click();
    await expect(page.getByText(/drop a screenshot/i)).toBeVisible();
  });

  test("image upload via file input", async ({ page }) => {
    await page.goto("/analyze");
    await page.getByRole("tab", { name: /screenshot/i }).click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "scam.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-data"),
    });

    await expect(page.getByText(/scam\.png/i)).toBeVisible();
  });
});
