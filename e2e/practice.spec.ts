import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

/** Finishes a lesson by trying each option until it's marked correct. */
async function finishLesson(page: Page, path: string) {
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

test("a finished drink lesson becomes review cards that can be graded", async ({ page }) => {
  await page.goto("/practice");
  await expect(
    page.getByRole("heading", { name: "Learn a drink to start reviewing" }),
  ).toBeVisible();

  await finishLesson(page, "/learn/sours/daiquiri");

  await page.goto("/");
  await page.getByRole("link", { name: "3 cards to review" }).click();
  await expect(page).toHaveURL("/practice/review");

  for (let i = 0; i < 3; i += 1) {
    await page.getByRole("button", { name: "Show answer" }).click();
    await page.getByRole("button", { name: /^Easy/ }).click();
  }
  await expect(page.getByRole("heading", { name: "Review done for today" })).toBeVisible();

  await page.goto("/practice");
  await expect(page.getByRole("heading", { name: "You're up to date" })).toBeVisible();
});

test("a spec can be added to review from the Library", async ({ page }) => {
  await page.goto("/library/negroni");
  await page.getByRole("button", { name: /Negroni: Review/ }).click();
  await expect(page.getByRole("button", { name: /In review/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.goto("/practice");
  await expect(page.getByRole("heading", { name: "3 cards to review" })).toBeVisible();
});

test("a Speed Round deals five tickets, scores them and records a personal best", async ({
  page,
}) => {
  await page.goto("/practice/speed-round");
  await page.getByRole("button", { name: /Start the round/ }).click();

  for (let ticket = 1; ticket <= 5; ticket += 1) {
    await expect(page.getByText(`Ticket ${String(ticket)} of 5`).first()).toBeVisible();
    await page.getByRole("toolbar", { name: "Ingredients" }).getByRole("button").first().click();
    await page.getByRole("button", { name: /Next: glass/ }).click();
    for (let step = 0; step < 4; step += 1) {
      await page
        .getByRole("list", { name: /^Step \d of 5/ })
        .getByRole("button")
        .first()
        .click();
    }
    await expect(page.getByRole("list", { name: /results/ })).toBeVisible();
    await page.getByRole("button", { name: ticket < 5 ? "Next ticket" : "See your score" }).click();
  }

  await expect(page.getByText("Round complete")).toBeVisible();
  await expect(page.getByText("New personal best")).toBeVisible();
  await page.goto("/practice/speed-round");
  await expect(page.getByText(/Personal best: \d+\/30/)).toBeVisible();
});

test("Bar Math checks an answer and shows the worked solution", async ({ page }) => {
  await page.goto("/practice/math");
  await page.getByLabel("Your answer").fill("not a number");
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByText("Enter a number.")).toBeVisible();

  await page.getByLabel("Your answer").fill("1");
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("heading", { name: "How to work it out" })).toBeVisible();
  await page.getByRole("button", { name: "Next problem" }).click();
  await expect(page.getByText("Problem 2 of 5")).toBeVisible();
});

test("the water pour log gives feedback on a reading", async ({ page }) => {
  await page.goto("/practice/pour");
  await page.getByRole("tab", { name: "Water pour log" }).click();
  await page.getByRole("radio", { name: /^1 oz/ }).click();
  await page
    .getByRole("group", { name: "What did the jigger read?" })
    .getByRole("button", { name: "1¼ oz" })
    .click();
  await expect(page.getByText("¼ oz over.")).toBeVisible();
});

test("the count-rhythm drill calibrates, then measures a held pour", async ({ page }) => {
  await page.goto("/practice/pour");
  const hold = page.getByRole("button", { name: /Hold for a 4-count/ });
  for (let i = 0; i < 3; i += 1) {
    await hold.focus();
    await page.keyboard.down(" ");
    await page.waitForTimeout(400);
    await page.keyboard.up(" ");
  }
  const pour = page.getByRole("button", { name: /Hold to pour/ });
  await expect(pour).toBeVisible();
  await pour.focus();
  await page.keyboard.down(" ");
  await page.waitForTimeout(400);
  await page.keyboard.up(" ");
  await expect(page.getByText(/Last pour: about/)).toBeVisible();
});
