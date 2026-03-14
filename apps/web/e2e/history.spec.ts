import { test, expect } from "@playwright/test";
import { mockHistoryAPI } from "./helpers/mocks";

test.describe("History Page", () => {
  test("shows empty state when no analyses", async ({ page }) => {
    await mockHistoryAPI(page, [], 0);
    await page.goto("/history");
    await expect(page.getByText(/no analyses yet/i)).toBeVisible();
  });

  test("shows history items", async ({ page }) => {
    await mockHistoryAPI(
      page,
      [
        {
          analysis_id: "h1",
          created_at: new Date().toISOString(),
          input_type: "text",
          risk_score: 85,
          risk_level: "HIGH",
          verdict: "Phishing attempt detected",
        },
        {
          analysis_id: "h2",
          created_at: new Date().toISOString(),
          input_type: "url",
          risk_score: 15,
          risk_level: "SAFE",
          verdict: "This appears safe",
        },
      ],
      2,
    );

    await page.goto("/history");
    await expect(page.getByTestId("history-card")).toHaveCount(2);
  });
});
