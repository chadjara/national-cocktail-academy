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
        if (message.type() === "error") errors.push(message.text());
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
  "/learn",
  "/learn/bar-tools",
  "/learn/bar-tools/strainers",
  "/learn/sours/margarita",
  "/learn/spirits",
  "/learn/bar-tools/exam",
  "/learn/service/scenarios-safe-ride",
  "/practice",
  "/practice/review",
  "/practice/speed-round",
  "/practice/pour",
  "/practice/math",
  "/privacy",
  "/design-system",
  "/not-a-real-page",
] as const;
