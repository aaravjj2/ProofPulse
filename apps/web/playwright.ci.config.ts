import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 2,
  workers: 2,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      command: "cd ../api && . .venv/bin/activate && OPENAI_API_KEY=test-key python -m uvicorn src.main:app --port 8001",
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
