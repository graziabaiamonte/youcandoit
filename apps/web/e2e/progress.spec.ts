import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

const SUB = "0.1.1.1";

test.beforeEach(async ({ page, request }) => {
  await request.delete(`/api/progress/${SUB}`);
  await skipWelcome(page);
});

test("ticking a subchapter awards XP, updates the map and survives a reload", async ({ page }) => {
  await page.goto("/session/0.1.1");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("How to learn effectively");
  const xp = page.getByTestId("xp-total");
  const before = parseInt((await xp.textContent()) ?? "0");

  const box = page.getByTestId(`sub-${SUB}`);
  await box.click();
  await expect(box).toBeChecked();
  await expect(xp).toContainText(`${before + 10} XP`);

  await page.reload();
  await expect(page.getByTestId(`sub-${SUB}`)).toBeChecked();

  await page.goto("/map");
  const track0 = page.getByTestId("map-track-0");
  await expect(track0).toBeVisible();
  expect(Number(await track0.getAttribute("data-percent"))).toBeGreaterThan(0);
});

test.afterEach(async ({ request }) => {
  await request.delete(`/api/progress/${SUB}`);
});

test("a subchapter expands to its lesson without ticking it", async ({ page }) => {
  await page.goto("/session/0.1.1");
  await page.getByRole("button", { name: /How memory works/ }).click();
  await expect(page.getByText("Think of your memory like a library")).toBeVisible();
  await expect(page.getByTestId(`sub-${SUB}`)).not.toBeChecked();
});
