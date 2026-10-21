import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

test("only the map is full width, also after navigating away from it", async ({ page }) => {
  await skipWelcome(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  const content = page.locator("main main");
  await page.goto("/map");
  await expect(page.getByTestId("map-track-0")).toBeVisible();
  expect((await content.boundingBox())!.width).toBeGreaterThan(1024);

  // client navigation: cacheComponents keeps the map in the DOM, hidden
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect.poll(async () => (await content.boundingBox())!.width).toBe(1024);
});
