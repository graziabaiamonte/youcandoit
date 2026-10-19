import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

const TITLE = "E2E: Kubernetes autoscaling explained";

test.beforeEach(async ({ page, request }) => {
  await skipWelcome(page);
  const articles: { id: number; title: string }[] = await (await request.get("/api/articles?limit=200")).json();
  const seeded = articles.find((a) => a.title === TITLE);
  if (seeded) await request.delete(`/api/articles/${seeded.id}/favorite`);
});

test("starring an article adds it to favorites and un-starring removes it", async ({ page }) => {
  await page.goto("/news");
  const card = page.getByTestId("articles-grid").getByTestId("article-card").filter({ hasText: TITLE });
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: /Save .* to favorites/ }).click();
  const favorites = page.getByTestId("favorites");
  await expect(favorites.getByText(TITLE)).toBeVisible();

  await favorites.getByRole("button", { name: /Remove .* from favorites/ }).click();
  await expect(favorites.getByText(TITLE)).toBeHidden();
});
