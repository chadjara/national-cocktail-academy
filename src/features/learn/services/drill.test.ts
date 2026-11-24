import { describe, expect, it } from "vitest";

/** Narrows away undefined, failing the test with a clear message instead. */
function defined<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("expected a value");
  return value;
}

import { getCocktail } from "~/content";
import { listCourses } from "~/content/curriculum";
import { questionSchema } from "~/content/curriculum/schema";

import { drillQuestions, presentQuestion } from "./drill";

const allDrills = listCourses().flatMap((course) =>
  course.lessons.flatMap((lesson) =>
    lesson.blocks.flatMap((block, index) =>
      block.kind === "drill" ? [{ block, seed: `${course.id}/${lesson.id}/${index}` }] : [],
    ),
  ),
);

describe("drillQuestions", () => {
  it("generates valid questions for every drill in the curriculum, in both unit systems", () => {
    for (const units of ["oz", "ml"] as const) {
      for (const { block, seed } of allDrills) {
        const questions = drillQuestions(block, units, seed);
        expect(questions.length, seed).toBeGreaterThan(0);
        for (const question of questions) {
          const result = questionSchema.safeParse(question);
          expect(
            result.success,
            `${seed} ${question.id}: ${JSON.stringify(question.options)}`,
          ).toBe(true);
          expect(question.options.length, `${seed} ${question.id}`).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it("is stable for a seed", () => {
    const { block, seed } = defined(allDrills[0]);
    expect(drillQuestions(block, "oz", seed)).toEqual(drillQuestions(block, "oz", seed));
  });

  it("asks every facet in a single-drink lesson and one per drink in a review", () => {
    const facets = ["glass", "ice", "method", "garnish", "amount"] as const;
    const single = drillQuestions(
      { kind: "drill", cocktailIds: ["daiquiri"], facets: [...facets], mode: "every-facet" },
      "oz",
      "s",
    );
    expect(single.map((q) => q.id.split(":")[1]).sort()).toEqual([...facets].sort());

    const review = drillQuestions(
      {
        kind: "drill",
        cocktailIds: ["daiquiri", "manhattan", "mojito"],
        facets: [...facets],
        mode: "rotate",
      },
      "oz",
      "r",
    );
    expect(review.map((q) => q.id.split(":")[0])).toEqual(["daiquiri", "manhattan", "mojito"]);
  });

  it("marks the spec's answer correct", () => {
    const daiquiri = defined(getCocktail("daiquiri"));
    const [glass] = drillQuestions(
      { kind: "drill", cocktailIds: ["daiquiri"], facets: ["glass"], mode: "every-facet" },
      "oz",
      "x",
    );
    expect(defined(glass).options[defined(glass).answer]).toBe("Cocktail glass");
    const [amount] = drillQuestions(
      { kind: "drill", cocktailIds: ["manhattan"], facets: ["amount"], mode: "every-facet" },
      "oz",
      "y",
    );
    expect(["1⅔ oz", "≈ 1⅔ oz", "⅔ oz", "≈ ⅔ oz"]).toContain(
      defined(amount).options[defined(amount).answer],
    );
    expect(daiquiri.garnish).toBeNull();
    const [garnish] = drillQuestions(
      { kind: "drill", cocktailIds: ["daiquiri"], facets: ["garnish"], mode: "every-facet" },
      "oz",
      "z",
    );
    expect(defined(garnish).options[defined(garnish).answer]).toBe("No garnish");
  });

  it("never offers two garnishes that mean the same thing", () => {
    for (let i = 0; i < 40; i += 1) {
      const [q] = drillQuestions(
        { kind: "drill", cocktailIds: ["dry-martini"], facets: ["garnish"], mode: "every-facet" },
        "oz",
        `g${i}`,
      );
      const lemony = defined(q).options.filter((option) => /lemon|olive/i.test(option));
      expect(lemony).toHaveLength(1);
    }
  });
});

describe("presentQuestion", () => {
  it("shuffles options and keeps the answer pointing at the right one", () => {
    const source = {
      prompt: "Which?",
      options: ["right", "a", "b", "c"],
      answer: 0,
      explanation: "Because it is.",
    };
    const seen = new Set<number>();
    for (let i = 0; i < 20; i += 1) {
      const shown = presentQuestion(source, `seed-${i}`);
      expect(shown.options[shown.answer]).toBe("right");
      seen.add(shown.answer);
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});
