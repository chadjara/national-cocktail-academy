import { expect, test } from "./fixtures";

test("search, filter and open a spec, then switch units", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("searchbox", { name: "Search specs" }).fill("negroni");
  const specs = page.getByRole("list", { name: "Specs" });
  await expect(specs.getByRole("link").first()).toContainText("Negroni");

  await page.getByRole("button", { name: "Gin", exact: true }).click();
  await expect(page).toHaveURL(/base=gin/);
  await expect(specs.getByRole("link", { name: /Boulevardier/ })).toHaveCount(0);

  await specs.getByRole("link", { name: /^Negroni/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Negroni" })).toBeVisible();

  const spec = page.getByRole("table", { name: "Negroni spec" });
  await expect(spec).toContainText("1 oz");
  await page.getByRole("radio", { name: "ml" }).click();
  await expect(spec).toContainText("30 ml");

  await page.reload();
  await expect(page.getByRole("table", { name: "Negroni spec" })).toContainText("30 ml");
});

test("filters survive the back button and an empty result explains itself", async ({ page }) => {
  await page.goto("/library?q=zzzz");
  await expect(page.getByRole("heading", { name: "No specs match" })).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(page.getByText("105 specs")).toBeVisible();
});

test("saving a spec shows it on Today, across reloads", async ({ page }) => {
  await page.goto("/library/last-word");
  await page.getByRole("button", { name: /Save/ }).click();
  await expect(page.getByRole("button", { name: /Saved/ })).toHaveAttribute("aria-pressed", "true");

  await page.goto("/");
  const saved = page.getByRole("list", { name: "Saved specs" });
  await expect(saved.getByRole("link", { name: /Last Word/ })).toBeVisible();
});

test("an unknown spec id gets a way back to the library", async ({ page }) => {
  await page.goto("/library/not-a-drink");
  await expect(page.getByRole("heading", { name: "That spec isn't in the library" })).toBeVisible();
});

test("My Bar shows what you can make and what to buy next", async ({ page }) => {
  await page.goto("/my-bar");
  await page.getByRole("checkbox", { name: "Bourbon" }).click();
  await expect(page.getByRole("tab", { name: /You can make · [1-9]/ })).toBeVisible();

  await page.getByRole("tab", { name: /You can make/ }).click();
  await expect(
    page.getByRole("list", { name: "Specs you can make" }).getByRole("link", { name: /Gold Rush/ }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Next bottle" }).click();
  await page.getByRole("button", { name: /^Add / }).first().click();
  await expect(page.getByRole("tab", { name: /Bottles · 2/ })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("tab", { name: /Bottles · 2/ })).toBeVisible();
});
