import {
  getCocktail,
  getIngredient,
  listCocktails,
  type Cocktail,
  type Ingredient,
} from "~/content";
import { listCourses } from "~/content/curriculum";
import { sample, seededRandom, shuffle, type Random } from "~/lib/rng";

import type { UnitSystem } from "../../library/services/units";
import { drillQuestions } from "../../learn/services/drill";

export const TICKETS_PER_ROUND = 5;
const INGREDIENT_OPTIONS = 8;

export type ChoiceField = "glass" | "ice" | "method" | "garnish";
export const CHOICE_FIELDS: readonly ChoiceField[] = ["glass", "ice", "method", "garnish"];

export type Choice = { prompt: string; options: string[]; answer: string };

export type Ticket = {
  cocktailId: string;
  name: string;
  /** Ingredient ids to pick from, and the ones in the spec. */
  ingredients: { options: { id: string; name: string }[]; correct: string[] };
  choices: Record<ChoiceField, Choice>;
};

export type TicketAnswer = { ingredients: readonly string[] } & Record<ChoiceField, string>;

export type TicketScore = {
  points: number;
  max: number;
  ingredientsRight: boolean;
  missing: string[];
  extra: string[];
  fields: Record<ChoiceField, boolean>;
};

/** Points per ticket: 2 for the ingredients, 1 each for glass, ice, method and garnish. */
export const POINTS_PER_TICKET = 6;

/** Ingredients a ticket asks about: what comes off the back bar and out of the fridge, not salt and water. */
function buildable(cocktail: Cocktail): Ingredient[] {
  const seen = new Set<string>();
  return cocktail.spec
    .map((line) => getIngredient(line.ingredient))
    .filter(
      (ingredient) =>
        ingredient.category !== "pantry" && !seen.has(ingredient.id) && seen.add(ingredient.id),
    );
}

function ingredientOptions(cocktail: Cocktail, random: Random): Ticket["ingredients"] {
  const correct = buildable(cocktail);
  const spec = cocktail.spec.map((line) => getIngredient(line.ingredient));
  const blocked = new Set(spec.map((ingredient) => ingredient.category));
  // A drink sweetened with sugar shouldn't be marked wrong for "simple syrup".
  if (spec.some((ingredient) => ingredient.id.startsWith("sugar") || ingredient.id === "honey"))
    blocked.add("syrup");

  const family = listCocktails().filter(
    (c) => c.family === cocktail.family && c.id !== cocktail.id,
  );
  const candidates = [
    ...shuffle(family.flatMap(buildable), random),
    ...shuffle(listCocktails().flatMap(buildable), random),
  ];
  const wrong: Ingredient[] = [];
  for (const candidate of candidates) {
    if (correct.length + wrong.length >= INGREDIENT_OPTIONS) break;
    if (blocked.has(candidate.category) || wrong.some((w) => w.id === candidate.id)) continue;
    wrong.push(candidate);
  }
  return {
    options: shuffle([...correct, ...wrong], random).map(({ id, name }) => ({ id, name })),
    correct: correct.map((ingredient) => ingredient.id),
  };
}

/** Drinks taught in the drink-family courses: the default pool before a student has learned any. */
export function coreCocktailIds(): string[] {
  return listCourses().flatMap((course) =>
    course.lessons.flatMap((lesson) =>
      lesson.blocks.flatMap((block) => (block.kind === "cocktail" ? [block.cocktailId] : [])),
    ),
  );
}

/**
 * A round of tickets, drawn from the drinks the student has learned when there
 * are enough of them, so practice reinforces what they've studied.
 */
export function makeRound(learned: readonly string[], units: UnitSystem, seed: string): Ticket[] {
  const random = seededRandom(seed);
  const pool = learned.length >= TICKETS_PER_ROUND ? learned : coreCocktailIds();
  return sample(pool, TICKETS_PER_ROUND, random).flatMap((id) => {
    const cocktail = getCocktail(id);
    if (!cocktail) return [];
    const questions = drillQuestions(
      { kind: "drill", cocktailIds: [id], facets: [...CHOICE_FIELDS], mode: "every-facet" },
      units,
      `${seed}/${id}`,
    );
    const choices = Object.fromEntries(
      CHOICE_FIELDS.map((field) => {
        const question = questions.find((q) => q.id === `${id}:${field}`);
        const options = question?.options ?? [];
        return [
          field,
          { prompt: question?.prompt ?? "", options, answer: options[question?.answer ?? 0] ?? "" },
        ];
      }),
    ) as Record<ChoiceField, Choice>;
    return [
      {
        cocktailId: id,
        name: cocktail.name,
        ingredients: ingredientOptions(cocktail, random),
        choices,
      },
    ];
  });
}

/** Scores one built ticket. The ingredients earn 2 points if exact, 1 with a single slip. */
export function scoreTicket(ticket: Ticket, answer: TicketAnswer): TicketScore {
  const picked = new Set(answer.ingredients);
  const correct = new Set(ticket.ingredients.correct);
  const missing = ticket.ingredients.correct.filter((id) => !picked.has(id));
  const extra = answer.ingredients.filter((id) => !correct.has(id));
  const slips = missing.length + extra.length;
  const fields = Object.fromEntries(
    CHOICE_FIELDS.map((field) => [field, answer[field] === ticket.choices[field].answer]),
  ) as Record<ChoiceField, boolean>;
  const points =
    (slips === 0 ? 2 : slips === 1 ? 1 : 0) + CHOICE_FIELDS.filter((field) => fields[field]).length;
  return { points, max: POINTS_PER_TICKET, ingredientsRight: slips === 0, missing, extra, fields };
}

/** Better = more points, then faster. */
export function isBetterRun(
  candidate: { score: number; durationMs: number },
  best: { score: number; durationMs: number } | undefined,
): boolean {
  if (!best) return true;
  return (
    candidate.score > best.score ||
    (candidate.score === best.score && candidate.durationMs < best.durationMs)
  );
}

export function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  return `${String(Math.floor(seconds / 60))}:${String(seconds % 60).padStart(2, "0")}`;
}
