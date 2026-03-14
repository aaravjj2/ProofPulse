import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      command: "cd ../api && OPENAI_API_KEY=test-key python -m uvicorn src.main:app --port 8001",
      url: "http://localhost:8001/api/v1/health",
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: "NEXT_PUBLIC_API_URL=http://localhost:8001 npm run dev -- -p 3000",
      url: "http://localhost:3000",
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
});
