import { test, expect } from "@playwright/test";
import { AnalyzerPage } from "./helpers/AnalyzerPage";
import { MOCK_IMAGE_HIGH } from "./helpers/mock-responses";

test.describe("Image Analysis", () => {
  test("Screenshot tab shows upload area", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.imageTab.click();
    await expect(analyzer.fileDropzone).toBeVisible();
    await expect(page.getByText(/drop a screenshot/i)).toBeVisible();
  });

  test("image upload via file input", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.imageTab.click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "scam.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-data"),
    });

    await expect(page.getByTestId("file-preview")).toContainText("scam.png");
  });

  test("analyze button enabled after file upload", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.imageTab.click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-data"),
    });

    await expect(analyzer.analyzeButton).toBeEnabled();
  });

  test("full image analysis flow with mock", async ({ page }) => {
    await page.route("**/api/v1/analyze/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_IMAGE_HIGH),
      }),
    );

    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.imageTab.click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "screenshot.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-data"),
    });

    await analyzer.analyzeButton.click();
    await expect(analyzer.resultCard).toBeVisible({ timeout: 15000 });
    await expect(analyzer.riskBadge).toContainText("High Risk");
  });

  test("analyze button disabled when no file selected", async ({ page }) => {
    await page.goto("/analyze");
    const analyzer = new AnalyzerPage(page);
    await analyzer.imageTab.click();
    await expect(analyzer.analyzeButton).toBeDisabled();
  });
});
