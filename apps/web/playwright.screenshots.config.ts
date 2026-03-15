import { defineConfig, devices } from "@playwright/test";

// Minimal config for screenshot capture — no local servers needed
// Runs against the live Vercel deployment
export default defineConfig({
  testDir: "./e2e",
  testMatch: "screenshots.spec.ts",
  fullyParallel: false,
  retries: 1,
  reporter: "line",
  use: {
    trace: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "chromium-screenshots",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        launchOptions: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
      },
    },
  ],
});
