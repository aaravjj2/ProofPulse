import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { MOCK_HIGH_RISK_RESPONSE } from "./helpers/mock-responses";

test.describe("Accessibility", () => {
  test("home page has no critical axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical",
    );
    expect(critical).toHaveLength(0);
  });

  test("analyze page has no critical axe violations", async ({ page }) => {
    await page.goto("/analyze");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical",
    );
    expect(critical).toHaveLength(0);
  });

  test("analyze page with result has no critical axe violations", async ({
    page,
  }) => {
    await page.route("**/api/v1/analyze/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_HIGH_RISK_RESPONSE),
      });
    });
    await page.goto("/analyze");
    await page.getByRole("textbox").fill("test message");
    await page.getByRole("button", { name: /^analyze$/i }).click();
    await page.getByTestId("analysis-result").waitFor({ timeout: 15000 });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical",
    );
    expect(critical).toHaveLength(0);
  });

  test("history page has no critical axe violations", async ({ page }) => {
    await page.route("**/api/v1/history**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], total: 0, page: 1, per_page: 20 }),
      });
    });
    await page.goto("/history");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical",
    );
    expect(critical).toHaveLength(0);
  });

  test("about page has no critical axe violations", async ({ page }) => {
    await page.goto("/about");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical",
    );
    expect(critical).toHaveLength(0);
  });

  test("all interactive elements are keyboard reachable on analyze page", async ({
    page,
  }) => {
    await page.goto("/analyze");
    let focusedCount = 0;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      if (focused && focused !== "BODY") focusedCount++;
    }
    expect(focusedCount).toBeGreaterThan(3);
  });
});
