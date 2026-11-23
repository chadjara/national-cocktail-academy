import { expect, test } from "./fixtures";

test("Today renders the academy and works without an account", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "National Cocktail Academy" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Spec library" })).toBeVisible();
});

test("unknown routes show the designed 404 with a way back", async ({ page }) => {
  await page.goto("/not-a-real-page");
  await expect(page.getByRole("heading", { name: "That's not on the menu." })).toBeVisible();
  await page.getByRole("link", { name: "Back to Today" }).click();
  await expect(page).toHaveURL("/");
});

test("design system documents every foundation and component group", async ({ page }) => {
  await page.goto("/design-system");
  for (const name of ["Theme", "Color", "Typography", "Components", "Voice"]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
});

test("an explicit theme choice survives reload and applies before hydration", async ({ page }) => {
  await page.goto("/design-system");
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload({ waitUntil: "commit" });
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
});

test("keyboard users can skip straight to content", async ({ page, isMobile }) => {
  test.skip(isMobile, "Skip links are a keyboard affordance.");
  await page.goto("/");
  // The app renders on the device; wait for the first screen before tabbing.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("dialogs trap focus and close on Escape", async ({ page }) => {
  await page.goto("/design-system");
  const opener = page.getByRole("button", { name: "Open dialog" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Leave the exam?" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("the privacy policy is published, dated and gives a way to get in touch", async ({ page }) => {
  const response = await page.goto("/privacy");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /cjaratech\.com\/national-cocktail-academy\/privacy/ }),
  ).toHaveAttribute("href", "https://cjaratech.com/national-cocktail-academy/privacy");
  await expect(page.getByText(/^Last updated /)).toBeVisible();
  await expect(page.getByRole("link", { name: /Get in touch here/ })).toHaveAttribute(
    "href",
    "https://cjaratech.com/contact.html",
  );
  await expect(
    page.getByRole("table", { name: "Information NCA keeps on your device" }),
  ).toBeVisible();
});
