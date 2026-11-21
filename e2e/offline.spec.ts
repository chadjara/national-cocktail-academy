import { expect, test } from "./fixtures";

test("after one visit, the app loads and navigates with no network", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // The first visit installs the worker; a reload puts the page under its control.
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
    .toBe(true);

  await context.setOffline(true);

  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "The Back Bar Academy" })).toBeVisible();

  await page.getByRole("link", { name: "See the design system" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Design system" })).toBeVisible();

  await page.goto("/somewhere-uncached");
  await expect(page.getByRole("heading", { name: "That's not on the menu." })).toBeVisible();
});
