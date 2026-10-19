import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

test.beforeEach(async ({ page }) => skipWelcome(page));

test("the tutor answers and cites the session's indexed sources", async ({ page }) => {
  test.setTimeout(180_000); // real local models can be slow; the fake provider is instant
  await page.goto("/session/0.1.1");
  await page.getByRole("button", { name: "Ask the tutor" }).click();
  await page.getByLabel("Your question").fill("What is a shell?");
  await page.getByRole("button", { name: "Send" }).click();

  const answer = page.getByTestId("chat-answer");
  await expect(answer).toBeVisible({ timeout: 170_000 });
  await expect(answer.getByRole("link", { name: /MIT The Missing Semester/ })).toHaveAttribute(
    "href",
    "https://missing.csail.mit.edu/",
  );
});

test("asking the reading list cites a saved article", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/news");
  await page.getByLabel("Your question").fill("How does Kubernetes autoscaling work?");
  await page.getByRole("button", { name: "Send" }).click();
  const answer = page.getByTestId("chat-answer");
  await expect(answer).toBeVisible({ timeout: 170_000 });
  await expect(answer.getByRole("link", { name: /Kubernetes autoscaling explained/ })).toBeVisible();
});
