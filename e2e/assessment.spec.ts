import { getCourse } from "../src/content/curriculum";
import { expect, test } from "./fixtures";
import { finishLesson } from "./helpers";

test("a course exam unlocks after its lessons, grades by lesson, and deals new questions on retake", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto("/learn/bar-tools/exam");
  await expect(
    page.getByRole("heading", { name: "Finish 7 more lessons to unlock" }),
  ).toBeVisible();

  for (const lesson of getCourse("bar-tools")?.lessons ?? []) {
    await finishLesson(page, `/learn/bar-tools/${lesson.id}`);
  }

  await page.goto("/learn/bar-tools");
  await page.getByRole("link", { name: "Take the exam" }).click();
  await page.getByRole("button", { name: "Start the exam" }).click();

  const firstPrompt = await page
    .getByRole("radiogroup")
    .first()
    .locator("..")
    .locator("legend")
    .innerText();
  for (let i = 0; i < 10; i += 1) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: i < 9 ? "Next question" : "Submit exam" }).click();
  }

  await expect(page.getByText("Exam result")).toBeVisible();
  await expect(page.getByRole("heading", { name: "By lesson" })).toBeVisible();

  await page.getByRole("button", { name: /Retake/ }).click();
  await expect(page.getByText("Question 1 of 10")).toBeVisible();
  const retakePrompts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    retakePrompts.push(await page.locator("legend").first().innerText());
    await page.getByRole("radio").first().click();
    if (i < 9) await page.getByRole("button", { name: "Next question" }).click();
  }
  expect(retakePrompts.join("|")).not.toBe(firstPrompt);

  await page.getByRole("button", { name: "Bar Tools" }).click();
  await page
    .getByRole("dialog", { name: "Leave the exam?" })
    .getByRole("button", { name: "Leave" })
    .click();
  await expect(page).toHaveURL("/learn/bar-tools");
  await expect(page.getByRole("region", { name: "Course exam" })).toContainText(/Best|Passed/);
});

test("an unsafe choice in a scenario means replaying it before the lesson completes", async ({
  page,
}) => {
  await page.goto("/learn/service/scenarios-safe-ride");
  const scenario = page.getByRole("region", { name: "Keys on the bar" });

  await scenario.getByRole("button", { name: /Wish them a good night/ }).click();
  await expect(scenario.getByText("Unsafe")).toBeVisible();
  await scenario.getByRole("button", { name: "Finish" }).click();
  await expect(scenario.getByText("Try it again")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lesson complete" })).toHaveCount(0);

  await scenario.getByRole("button", { name: "Replay the scenario" }).click();
  await scenario.getByRole("button", { name: /Say you're worried/ }).click();
  await expect(scenario.getByText("Good call")).toBeVisible();
  await scenario.getByRole("button", { name: "Continue" }).click();
  await scenario.getByRole("button", { name: /Get your manager right away/ }).click();
  await scenario.getByRole("button", { name: "Finish" }).click();
  await expect(scenario.getByText("Scenario complete")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lesson complete" })).toBeVisible();
});

test("the Spirits & Products course is part of the program", async ({ page }) => {
  await page.goto("/learn");
  await page.getByRole("link", { name: "Spirits & Products" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Spirits & Products" })).toBeVisible();
  await page.getByRole("link", { name: /American whiskey/ }).click();
  const question = page.getByRole("group", { name: /What must a bourbon's mash be made of/ });
  await question.getByRole("button", { name: "At least 51% corn" }).click();
  await expect(question.getByRole("status")).toContainText("Correct.");
});
