import { expect, test } from "@playwright/test";

test("shows a motivational quote on open and can be dismissed", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByTestId("welcome-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("blockquote")).not.toBeEmpty();
  await expect(dialog.locator("figcaption")).toContainText("—");
  await dialog.getByRole("button", { name: "Let's study" }).click();
  await expect(dialog).toBeHidden();

  // shown once per browser session
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your path to senior engineer" })).toBeVisible();
  await expect(page.getByTestId("welcome-dialog")).toBeHidden();
});
