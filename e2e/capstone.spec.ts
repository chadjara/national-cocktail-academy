import { readFile } from "node:fs/promises";

import type { Page } from "@playwright/test";

import { listCourses } from "../src/content/curriculum";
import { expect, test } from "./fixtures";
import { finishLesson } from "./helpers";

const at = "2026-11-25T10:00:00.000Z";

/** A backup in which every course exam and the Service Sim are passed. */
function graduateBackup(): string {
  return JSON.stringify({
    format: "nca-backup",
    version: 1,
    exportedAt: at,
    appVersion: "0.6.0",
    tables: {
      meta: [],
      // Exams unlock only after their lessons, so a graduate has finished every lesson too.
      lessonProgress: listCourses().flatMap((course) =>
        course.lessons.map((lesson) => ({
          id: `${course.id}/${lesson.id}`,
          courseId: course.id,
          lessonId: lesson.id,
          completedAt: at,
        })),
      ),
      examAttempts: listCourses().map((course, i) => ({
        id: i + 1,
        courseId: course.id,
        seed: String(i),
        questionIds: ["q"],
        score: 9,
        total: 10,
        passed: true,
        topics: [{ lessonId: course.lessons[0]?.id ?? "x", right: 9, total: 10 }],
        startedAt: at,
        submittedAt: at,
      })),
      capstoneAttempts: [
        {
          id: 1,
          score: 50,
          total: 56,
          unsafe: false,
          passed: true,
          durationMs: 400_000,
          finishedAt: at,
        },
      ],
    },
  });
}

async function restore(page: Page, contents: string) {
  await page.goto("/settings");
  await page.getByLabel("Backup file").setInputFiles({
    name: "nca-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(contents),
  });
}

test("a full Service Sim shift ends with a result that's saved", async ({ page }) => {
  await page.goto("/capstone");
  await page.getByRole("button", { name: "Start the shift" }).click();

  for (let step = 0; step < 12; step += 1) {
    const ingredients = page.getByRole("toolbar", { name: "Ingredients" });
    if (await ingredients.isVisible()) {
      await ingredients.getByRole("button").first().click();
      await page.getByRole("button", { name: /Next: glass/ }).click();
      for (let choice = 0; choice < 4; choice += 1) {
        await page
          .getByRole("list", { name: /^Step \d of 5/ })
          .getByRole("button")
          .first()
          .click();
      }
    } else {
      await page.getByRole("list", { name: "What do you do?" }).getByRole("button").first().click();
    }
    await page.getByRole("button", { name: step < 11 ? "Next" : "End the shift" }).click();
  }

  await expect(page.getByText("Shift over")).toBeVisible();
  await expect(page.getByRole("list", { name: "Your shift" }).getByRole("listitem")).toHaveCount(
    12,
  );
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Learn" })
    .click();
  await page.getByRole("link", { name: "Service Sim" }).click();
  await expect(page.getByText(/best \d+% in \d+:\d{2}/)).toBeVisible();
});

test("the certificate lists what's left, then issues once everything is passed", async ({
  page,
}) => {
  await page.goto("/certificate");
  await expect(page.getByText(`0 of ${String(listCourses().length + 1)} complete`)).toBeVisible();
  await expect(page.getByRole("heading", { name: "You've earned your certificate" })).toHaveCount(
    0,
  );

  await restore(page, graduateBackup());
  const dialog = page.getByRole("dialog", { name: "Restore this backup?" });
  await expect(dialog).toContainText(`${String(listCourses().length)} exams passed`);
  await dialog.getByRole("button", { name: "Restore" }).click();
  await expect(page.getByText("Backup restored").first()).toBeVisible();

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Today" })
    .click();
  await expect(page.getByRole("heading", { name: "Your certificate is ready" })).toBeVisible();
  await page.getByRole("link", { name: "Get your certificate" }).click();

  await page.getByRole("button", { name: "Issue certificate" }).click();
  await expect(page.getByText("Enter the name to print on your certificate.")).toBeVisible();
  await page.getByLabel("Name on your certificate").fill("Alex Rivera");
  await page.getByRole("button", { name: "Issue certificate" }).click();

  const preview = page.getByRole("figure", { name: "Certificate preview" });
  await expect(preview).toContainText("Alex Rivera");
  await expect(preview).toContainText(/NCA-[A-Z2-9]{4}-[A-Z2-9]{4}/);

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save or share PDF" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^NCA-Certificate-NCA-.+\.pdf$/);
  const bytes = await readFile(await file.path());
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
});

test("a backup downloads as a valid file, and a foreign file is rejected", async ({ page }) => {
  await page.goto("/settings");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save a backup" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^nca-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const backup = JSON.parse(await readFile(await file.path(), "utf8")) as { format: string };
  expect(backup.format).toBe("nca-backup");

  await restore(page, JSON.stringify({ hello: "world" }));
  await expect(page.getByRole("alert")).toContainText("isn't a National Cocktail Academy backup");
});

test("erasing all progress asks first, then starts the student over", async ({ page }) => {
  await finishLesson(page, "/learn/bar-tools/your-station");
  await page.goto("/settings");
  await page.getByRole("button", { name: "Erase all progress" }).click();
  await page
    .getByRole("dialog", { name: "Erase all progress?" })
    .getByRole("button", { name: "Erase everything" })
    .click();
  await expect(page.getByText("All progress erased").first()).toBeVisible();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Today" })
    .click();
  await expect(page.getByText("Start here")).toBeVisible();
});
