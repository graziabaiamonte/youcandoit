import { defineConfig, devices } from "@playwright/test";

// Runs against a live stack (docker compose up + scripts/e2e-seed.sh).
// Use LLM_PROVIDER=fake on the API for deterministic AI answers (CI does).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // specs share one database
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
