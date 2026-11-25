import { expect, test } from "./fixtures";

test("a drink with a photo shows it, credited, and the credit leads to the Credits page", async ({
  page,
}) => {
  await page.goto("/library/negroni");
  const photo = page.getByRole("img", { name: /^Negroni in a rocks glass/ });
  await expect(photo).toBeVisible();
  await expect
    .poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByText(/Photo: .+ · CC BY/)).toBeVisible();

  await page.getByRole("link", { name: "Credits" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Photo credits" })).toBeVisible();
  const drinks = page.getByRole("list", { name: "Drink photos" });
  await expect(drinks.getByText("Negroni", { exact: true })).toBeVisible();
  await expect(drinks.getByRole("link", { name: /CC BY 2\.0/ }).first()).toHaveAttribute(
    "href",
    /creativecommons\.org/,
  );
});

test("a drink without a photo shows its illustration, drawn from the spec", async ({ page }) => {
  await page.goto("/library/mai-tai");
  await expect(page.getByRole("img", { name: /^Mai Tai in a rocks glass/ })).toBeVisible();
  await expect(page.getByText("Illustration drawn from the spec.")).toBeVisible();
});

test("covers and thumbnails load across Today, Learn and the Library", async ({ page }) => {
  for (const path of ["/", "/learn", "/library"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const images = page.locator("main img");
    await expect.poll(() => images.count()).toBeGreaterThan(0);
    const first = images.first();
    await first.scrollIntoViewIfNeeded();
    await expect
      .poll(() => first.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  }
});
