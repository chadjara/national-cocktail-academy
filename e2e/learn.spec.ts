import { expect, test } from "./fixtures";

test("a new student is pointed at the first lesson, from Today and from Learn", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Your station" })).toBeVisible();
  await page.getByRole("link", { name: "Start the first lesson" }).click();
  await expect(page).toHaveURL("/learn/bar-tools/your-station");
  await expect(page.getByRole("heading", { level: 1, name: "Your station" })).toBeVisible();

  await page.goto("/learn");
  await expect(page.getByRole("heading", { level: 2, name: "Foundations" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Drink families" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Bar Tools" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sours" })).toBeVisible();
});

test("a wrong answer can be retried; answering everything finishes and saves the lesson", async ({
  page,
}) => {
  await page.goto("/learn/bar-tools/strainers");
  const first = page.getByRole("group", { name: /Which strainer goes with a mixing glass/ });
  await first.getByRole("button", { name: "Hawthorne strainer" }).click();
  await expect(first.getByRole("status")).toContainText("Not quite");
  await first.getByRole("button", { name: /^Julep strainer/ }).click();
  await expect(first.getByRole("status")).toContainText("Correct.");

  const second = page.getByRole("group", { name: /double strain a Gin Basil Smash/ });
  await second.getByRole("button", { name: /catch the bits of muddled basil/ }).click();

  await expect(page.getByRole("heading", { name: "Lesson complete" })).toBeVisible();
  await page.getByRole("link", { name: /Next: Barspoon, mixing glass and muddler/ }).click();
  await expect(page).toHaveURL("/learn/bar-tools/spoon-glass-muddler");

  await page.goto("/learn/bar-tools");
  await expect(page.getByRole("link", { name: /Strainers.*\(complete\)/ })).toBeVisible();
  await expect(page.getByText("1 of 7 lessons complete")).toBeVisible();

  await page.goto("/");
  await expect(page.getByText("Continue learning")).toBeVisible();
});

test("a drink lesson teaches the live spec and quizzes it in the student's units", async ({
  page,
}) => {
  await page.goto("/learn/sours/margarita");
  await expect(page.getByRole("heading", { level: 1, name: "Margarita" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Margarita spec" })).toContainText("oz");
  await expect(
    page.getByRole("group", { name: /How much blanco tequila goes in a Margarita/ }),
  ).toContainText("oz");
  await page.getByRole("radio", { name: "ml" }).click();
  await expect(page.getByRole("table", { name: "Margarita spec" })).toContainText("50 ml");
  await expect(page.getByRole("group", { name: /How much blanco tequila/ })).toContainText("50 ml");
});

test("resetting a course asks first", async ({ page }) => {
  await page.goto("/learn/service/taking-orders");
  await page.getByRole("group").first().getByRole("button", { name: "The French 75" }).click();
  await expect(page.getByRole("heading", { name: "Lesson complete" })).toBeVisible();

  await page.goto("/learn/service");
  await page.getByRole("button", { name: "Reset progress for this course" }).click();
  const dialog = page.getByRole("dialog", { name: "Reset Service & Responsibility?" });
  await dialog.getByRole("button", { name: "Reset course" }).click();
  await expect(
    page
      .getByRole("button", { name: "Start the course" })
      .or(page.getByRole("link", { name: "Start the course" })),
  ).toBeVisible();
});

test("an unknown lesson gets a way back to the program", async ({ page }) => {
  await page.goto("/learn/sours/not-a-lesson");
  await expect(
    page.getByRole("heading", { name: "That lesson isn't in the program" }),
  ).toBeVisible();
});
