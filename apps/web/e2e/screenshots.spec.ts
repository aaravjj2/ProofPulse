import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Ensure screenshots directory exists
const screenshotDir = '/home/aarav/Aarav/ProofPulse/docs/screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const BASE_URL = process.env.SCREENSHOT_URL || 'https://proofpulse-green.vercel.app';

const CRITICAL_RESPONSE = {
  id: 'demo-critical',
  risk_score: 96,
  risk_level: 'CRITICAL',
  verdict: 'This is a scam. Do not engage.',
  evidence: [
    {
      signal: 'Artificial urgency with threat of arrest',
      detail: '"Failure to pay via wire transfer within 24 hours will result in ARREST" — the IRS never demands immediate wire transfers or threatens arrest via text/email.',
      severity: 'CRITICAL',
    },
    {
      signal: 'Suspicious domain: irs-tax-payments.xyz',
      detail: 'The .xyz TLD is not used by any legitimate US government agency. The real IRS website is irs.gov.',
      severity: 'CRITICAL',
    },
    {
      signal: 'Wire transfer demand',
      detail: 'Legitimate government agencies never demand payment by wire transfer, gift card, or cryptocurrency.',
      severity: 'HIGH',
    },
    {
      signal: 'Specific dollar amount to create credibility',
      detail: '"$3,847 in back taxes" — scammers use exact figures to appear legitimate and create urgency.',
      severity: 'MEDIUM',
    },
  ],
  next_steps: [
    'Do not click any links or call any numbers in the message.',
    'If you believe you owe taxes, call the IRS directly at 1-800-829-1040.',
    'Report this scam to the IRS at phishing@irs.gov.',
  ],
  input_type: 'text',
  created_at: new Date().toISOString(),
};

const SAFE_RESPONSE = {
  id: 'demo-safe',
  risk_score: 3,
  risk_level: 'SAFE',
  verdict: 'This message appears legitimate.',
  evidence: [
    {
      signal: 'Natural conversational tone',
      detail: 'The message uses casual, friendly language consistent with a colleague or acquaintance.',
      severity: 'LOW',
    },
    {
      signal: 'No suspicious links or requests',
      detail: 'No URLs, payment requests, or urgency indicators present.',
      severity: 'LOW',
    },
    {
      signal: 'Context-appropriate content',
      detail: 'Conference follow-up with slides is a common, legitimate communication pattern.',
      severity: 'LOW',
    },
  ],
  next_steps: ['No action required — this message appears safe.'],
  input_type: 'text',
  created_at: new Date().toISOString(),
};

const HISTORY_RESPONSE = {
  items: [
    { ...CRITICAL_RESPONSE, id: 'h1', created_at: new Date(Date.now() - 60000).toISOString() },
    { ...SAFE_RESPONSE, id: 'h2', created_at: new Date(Date.now() - 120000).toISOString() },
    {
      id: 'h3',
      risk_score: 72,
      risk_level: 'HIGH',
      verdict: 'This URL shows multiple phishing indicators.',
      evidence: [],
      next_steps: [],
      input_type: 'url',
      created_at: new Date(Date.now() - 180000).toISOString(),
    },
    {
      id: 'h4',
      risk_score: 45,
      risk_level: 'MEDIUM',
      verdict: 'Some suspicious patterns detected.',
      evidence: [],
      next_steps: [],
      input_type: 'text',
      created_at: new Date(Date.now() - 240000).toISOString(),
    },
  ],
  total: 4,
  page: 1,
  per_page: 20,
};

test.describe('ProofPulse Screenshots', () => {
  // Single shared browser context for speed
  test.use({ viewport: { width: 1440, height: 900 } });

  test('01 - Home Page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable dark mode
    const themeBtn = page.locator('button[aria-label*="mode"], button[aria-label*="dark"], button[aria-label*="theme"]');
    if (await themeBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await themeBtn.first().click();
      await page.waitForTimeout(600);
    }

    await page.screenshot({ path: `${screenshotDir}/01-home.png`, fullPage: true });
    console.log('✓ 01-home.png');
  });

  test('02 - Critical Result', async ({ page }) => {
    const RAILWAY_URL = 'https://proofpulse-production.up.railway.app';
    // Mock the analyze endpoint — both Railway and localhost patterns
    await page.route(`${RAILWAY_URL}/api/v1/analyze/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CRITICAL_RESPONSE) })
    );
    await page.route('**/api/v1/analyze/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CRITICAL_RESPONSE) })
    );
    await page.route('**/api/v1/analyze', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CRITICAL_RESPONSE) })
    );

    await page.goto(`${BASE_URL}/analyze`, { waitUntil: 'networkidle' });

    // Enable dark mode
    const themeBtn = page.locator('button[aria-label*="mode"]');
    if (await themeBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await themeBtn.first().click();
      await page.waitForTimeout(500);
    }

    const textarea = page.locator('textarea').first();
    await textarea.fill(
      'URGENT: IRS FINAL NOTICE — you owe $3,847 in back taxes. ' +
        'Failure to pay via wire transfer within 24 hours will result ' +
        'in ARREST. Settle now: irs-tax-payments.xyz/pay'
    );

    const analyzeBtn = page.locator('button:has-text("Analyze")').first();
    await analyzeBtn.click();

    // Wait for result to appear (result card or risk score)
    await page.waitForSelector('[data-testid="analysis-result"], [class*="RiskScore"], [class*="risk-score"], text=CRITICAL', {
      timeout: 8000,
      state: 'attached',
    }).catch(() => page.waitForTimeout(4000));

    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${screenshotDir}/02-critical-result.png`, fullPage: true });
    console.log('✓ 02-critical-result.png');

    // Also grab evidence section separately
    const evidenceSection = page.locator('[data-testid="evidence-section"], section:has-text("Evidence")').first();
    if (await evidenceSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await evidenceSection.screenshot({ path: `${screenshotDir}/03-evidence.png` });
      console.log('✓ 03-evidence.png');
    }
  });

  test('04 - History Page', async ({ page }) => {
    // Mock the history endpoint
    await page.route('**/api/v1/history**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HISTORY_RESPONSE) })
    );

    await page.goto(`${BASE_URL}/history`, { waitUntil: 'networkidle' });

    // Enable dark mode
    const themeBtn = page.locator('button[aria-label*="mode"]');
    if (await themeBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await themeBtn.first().click();
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/04-history.png`, fullPage: true });
    console.log('✓ 04-history.png');
  });

  test('05 - Safe Result', async ({ page }) => {
    await page.route('**/api/v1/analyze/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SAFE_RESPONSE) })
    );
    await page.route('**/api/v1/analyze', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SAFE_RESPONSE) })
    );

    await page.goto(`${BASE_URL}/analyze`, { waitUntil: 'networkidle' });

    // Enable dark mode
    const themeBtn = page.locator('button[aria-label*="mode"]');
    if (await themeBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await themeBtn.first().click();
      await page.waitForTimeout(500);
    }

    const textarea = page.locator('textarea').first();
    await textarea.fill(
      "Hey! It was great meeting you at the conference. I'll send you the slides this afternoon. Let me know if you have questions!"
    );

    const analyzeBtn = page.locator('button:has-text("Analyze")').first();
    await analyzeBtn.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: `${screenshotDir}/05-safe-result.png`, fullPage: true });
    console.log('✓ 05-safe-result.png');
  });
});
