import type { Page } from "@playwright/test";

import { expect } from "./fixtures";

/** Finishes a question-only lesson by trying each option until it's marked correct, and waits for the save. */
export async function finishLesson(page: Page, path: string) {
  await page.goto(path);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const group of await page.getByRole("group").all()) {
    for (const option of await group.getByRole("button").all()) {
      await option.click();
      if ((await group.getByRole("status").innerText()).includes("Correct")) break;
    }
  }
  await expect(page.getByRole("heading", { name: "Lesson complete" })).toBeVisible();
  // The badge appears once the finish is saved on the device, so a reload can't lose it.
  await expect(page.getByText("Completed", { exact: true })).toBeVisible();
}
