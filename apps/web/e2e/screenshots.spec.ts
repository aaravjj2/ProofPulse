import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Ensure screenshots directory exists
const screenshotDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe('ProofPulse Screenshots & Demo Video', () => {
  let page: any;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Set viewport to 1920x1080 for quality screenshots
    await page.setViewportSize({ width: 1920, height: 1080});
  });

  test('Screenshot 1: Home Page', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Enable dark mode via button
    const themeButton = page.locator('button[aria-label*="dark mode"], button[aria-label*="light mode"]');
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: `${screenshotDir}/01-home.png`, fullPage: true });
    console.log('✓ Screenshot 1: Home page');
  });

  test('Screenshot 2: Critical Result & Evidence', async () => {
    await page.goto('http://localhost:3000/analyze', { waitUntil: 'networkidle' });

    // Mock the API response
    await page.route('**/api/v1/analyze/**', async (route) => {
      await route.abort();
    });

    // Get the text input and paste scam message
    const textarea = page.locator('textarea');
    await textarea.click();
    await textarea.fill(
      'URGENT: IRS FINAL NOTICE — you owe $3,847 in back taxes. ' +
      'Failure to pay via wire transfer within 24 hours will result ' +
      'in ARREST. Settle now: irs-tax-payments.xyz/pay'
    );

    // Click analyze (this will be mocked in real E2E)
    const analyzeButton = page.locator('button:has-text("Analyze")');
    await analyzeButton.first().click();

    // Wait for result (mock will show it)
    await page.waitForTimeout(2000);

    // Screenshot the result card
    const resultCard = page.locator('[data-testid="analysis-result"]');
    if (await resultCard.isVisible()) {
      await resultCard.screenshot({ path: `${screenshotDir}/02-critical-result.png` });
      console.log('✓ Screenshot 2: Critical result');
    }
  });

  test('Screenshot 3: History Page', async () => {
    await page.goto('http://localhost:3000/history', { waitUntil: 'networkidle' });

    // Mock history response
    await page.route('**/api/v1/history**', async (route) => {
      await route.abort();
    });

    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/03-history.png`, fullPage: true });
    console.log('✓ Screenshot 3: History page');
  });

  test('Screenshot 4: Safe Message Result', async () => {
    await page.goto('http://localhost:3000/analyze', { waitUntil: 'networkidle' });

    const textarea = page.locator('textarea');
    await textarea.fill(
      'Hey! It was great meeting you at the conference. ' +
      'I\'ll send you the slides this afternoon. Let me know if you have questions!'
    );

    // Click analyze
    const analyzeButton = page.locator('button:has-text("Analyze")');
    await analyzeButton.first().click();

    await page.waitForTimeout(2000);

    // Screenshot the result
    const resultCard = page.locator('[data-testid="analysis-result"]');
    if (await resultCard.isVisible()) {
      await resultCard.screenshot({ path: `${screenshotDir}/04-safe-result.png` });
      console.log('✓ Screenshot 4: Safe result');
    }
  });

  test('Screenshot 5: Dark Mode Toggle', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Find and click theme toggle
    const themeButton = page.locator('button[aria-label*="mode"]');
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(500);
    }

    // Screenshot dark mode nav
    const navbar = page.locator('nav');
    if (await navbar.isVisible()) {
      await navbar.screenshot({ path: `${screenshotDir}/05-dark-mode.png` });
      console.log('✓ Screenshot 5: Dark mode toggle');
    }
  });

  test.afterAll(async () => {
    await page.close();
  });
});
