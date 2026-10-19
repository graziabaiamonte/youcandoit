import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

test.beforeEach(async ({ page }) => {
  await skipWelcome(page);
});

test("a session with a lesson renders text, a diagram, callouts and an inline quiz", async ({ page }) => {
  await page.goto("/session/0.1.1");
  const lesson = page.locator("#lesson");
  await expect(lesson).toBeVisible();
  await expect(lesson.getByRole("heading", { name: "Lesson", exact: true })).toBeVisible();

  // Mermaid renders client-side into an svg.
  await expect(lesson.getByRole("img", { name: "Lesson diagram" }).first().locator("svg")).toBeVisible();
  // Callouts render as a Card with a label (the "[!NOTE]" marker is stripped).
  await expect(lesson.getByText("Note", { exact: true }).first()).toBeVisible();
  await expect(lesson).not.toContainText("[!NOTE]");

  const quiz = lesson.locator("fieldset").first();
  const explanation = quiz.locator("p");
  await expect(explanation).toHaveCount(0);
  await quiz.getByRole("button").first().click();
  await expect(explanation).toBeVisible();
});
