import { test as base, expect } from "@playwright/test";

/**
 * Fails any test whose page logs an error or a CSP violation, so a broken
 * policy or a runtime exception can't slip through a passing assertion.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        // GitHub Pages serves the SPA fallback for unknown URLs with a real 404
        // status, which the browser logs. That is the intended behavior.
        const isDocument404 =
          message.text().includes("status of 404") && message.location().url === page.url();
        if (!isDocument404) errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      await use(errors);
      expect(errors, "console errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const routes = [
  "/",
  "/library",
  "/library/negroni",
  "/library/ramos-fizz",
  "/my-bar",
  "/design-system",
  "/not-a-real-page",
] as const;
