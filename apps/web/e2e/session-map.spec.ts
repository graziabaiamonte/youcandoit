import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

test("session map labels fit their boxes at a fractional browser zoom", async ({ page }) => {
  await skipWelcome(page);
  // 90% zoom: Mermaid's HTML labels stopped wrapping here and were cut off
  await page.addInitScript(() =>
    document.addEventListener("DOMContentLoaded", () => (document.documentElement.style.zoom = "0.9")),
  );
  await page.goto("/session/0.1.1");
  await page.getByRole("button", { name: /Session map/ }).click();
  const nodes = page.locator(".session-mindmap g.mindmap-node");
  await expect(nodes.first()).toBeVisible();

  const overflowing = await nodes.evaluateAll((gs) =>
    gs.flatMap((g) => {
      const box = g.querySelector("rect, path")!.getBoundingClientRect();
      const text = g.querySelector("text")!.getBoundingClientRect();
      return text.width > box.width + 1 || text.height > box.height + 1 ? [g.textContent] : [];
    }),
  );
  expect(overflowing).toEqual([]);
});
