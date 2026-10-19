import type { Page } from "@playwright/test";

/** Mark the welcome dialog as seen so it doesn't cover the page under test. */
export async function skipWelcome(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("ycdi:welcome-seen", "1"));
}
