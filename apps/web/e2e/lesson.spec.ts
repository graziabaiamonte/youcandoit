import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

test.beforeEach(async ({ page }) => {
  await skipWelcome(page);
});

test("a session with a lesson renders text, a diagram and callouts", async ({ page }) => {
  await page.goto("/session/0.1.1");
  // Each subchapter expands to its lesson section; the first one has the diagram and a callout.
  await page.getByRole("button", { name: /How memory works/ }).click();
  const lesson = page.getByRole("region", { name: /How memory works/ });
  await expect(lesson).toBeVisible();

  // Mermaid renders client-side into an svg.
  await expect(lesson.getByRole("img", { name: "Lesson diagram" }).first().locator("svg")).toBeVisible();
  // Callouts render as a Card with a label (the "[!NOTE]" marker is stripped).
  await expect(lesson.getByText("Note", { exact: true }).first()).toBeVisible();
  await expect(lesson).not.toContainText("[!NOTE]");
});
