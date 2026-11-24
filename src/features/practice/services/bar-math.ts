import { sample, seededRandom, shuffle, type Random } from "~/lib/rng";

/** A 750 ml bottle, in US fluid ounces, rounded the way bar managers use it. */
export const OZ_PER_750 = 25.4;

export type MathUnit = "$" | "%" | "oz" | "bottles";

export type MathProblem = {
  id: string;
  topic:
    | "Pour cost"
    | "Pour-cost percentage"
    | "Menu pricing"
    | "Batching"
    | "Dilution"
    | "Bottles needed"
    | "Par levels";
  prompt: string;
  answer: number;
  unit: MathUnit;
  /** How far off an answer can be and still count, in the answer's unit. */
  tolerance: number;
  /** The worked solution, one line per step. */
  solution: string[];
};

export const PROBLEMS_PER_SET = 5;

const money = (value: number) => `$${value.toFixed(2)}`;
const pick = <T>(items: readonly T[], random: Random): T => {
  const [item] = sample(items, 1, random);
  if (item === undefined) throw new Error("empty choice");
  return item;
};
const round = (value: number, places: number) => Math.round(value * 10 ** places) / 10 ** places;

function pourCost(random: Random): MathProblem {
  const price = pick([18, 22, 24, 28, 30, 34, 40, 45], random);
  const pour = pick([1, 1.5, 2], random);
  const pours = OZ_PER_750 / pour;
  const cost = price / pours;
  return {
    id: `pour-cost-${String(price)}-${String(pour)}`,
    topic: "Pour cost",
    prompt: `A 750 ml bottle of gin costs ${money(price)}. What does one ${String(pour)} oz pour cost?`,
    answer: round(cost, 2),
    unit: "$",
    tolerance: 0.02,
    solution: [
      `A 750 ml bottle holds about ${String(OZ_PER_750)} oz.`,
      `${String(OZ_PER_750)} oz ÷ ${String(pour)} oz = ${pours.toFixed(1)} pours per bottle.`,
      `${money(price)} ÷ ${pours.toFixed(1)} = ${money(cost)} a pour.`,
    ],
  };
}

function pourCostPercent(random: Random): MathProblem {
  const cost = pick([1.8, 2.1, 2.4, 2.6, 3.0, 3.25], random);
  const price = pick([10, 12, 13, 14, 15, 16], random);
  const percent = (cost / price) * 100;
  return {
    id: `pour-pct-${String(cost)}-${String(price)}`,
    topic: "Pour-cost percentage",
    prompt: `A cocktail's ingredients cost ${money(cost)} and it sells for ${money(price)}. What's its pour-cost percentage?`,
    answer: round(percent, 1),
    unit: "%",
    tolerance: 0.5,
    solution: [
      "Pour cost % = ingredient cost ÷ menu price × 100.",
      `${money(cost)} ÷ ${money(price)} = ${(cost / price).toFixed(3)}.`,
      `× 100 = ${percent.toFixed(1)}%. Many bars aim for roughly 18–24% on cocktails.`,
    ],
  };
}

function menuPrice(random: Random): MathProblem {
  const cost = pick([1.8, 2.2, 2.5, 2.75, 3.0, 3.3], random);
  const target = pick([18, 20, 22, 25], random);
  const price = cost / (target / 100);
  return {
    id: `menu-${String(cost)}-${String(target)}`,
    topic: "Menu pricing",
    prompt: `A drink costs ${money(cost)} to make. What should it sell for to hit a ${String(target)}% pour cost?`,
    answer: round(price, 2),
    unit: "$",
    tolerance: 0.05,
    solution: [
      "Menu price = ingredient cost ÷ target pour cost.",
      `${money(cost)} ÷ ${(target / 100).toFixed(2)} = ${money(price)}.`,
      "Most bars then round to a clean menu price.",
    ],
  };
}

type Batch = { name: string; parts: readonly (readonly [ingredient: string, oz: number])[] };

const BATCHES: readonly Batch[] = [
  {
    name: "Negroni",
    parts: [
      ["gin", 1],
      ["Campari", 1],
      ["sweet vermouth", 1],
    ],
  },
  {
    name: "Manhattan",
    parts: [
      ["rye", 2],
      ["sweet vermouth", 1],
    ],
  },
  {
    name: "Boulevardier",
    parts: [
      ["bourbon", 1.5],
      ["Campari", 1],
      ["sweet vermouth", 1],
    ],
  },
];

function batching(random: Random): MathProblem {
  const recipe = pick(BATCHES, random);
  const servings = pick([8, 10, 12, 16, 20, 24], random);
  const [ingredient, oz] = pick(recipe.parts, random);
  const total = oz * servings;
  return {
    id: `batch-${recipe.name}-${ingredient}-${String(servings)}`,
    topic: "Batching",
    prompt: `You're batching ${String(servings)} ${recipe.name}s. The spec is ${recipe.parts.map(([name, amount]) => `${String(amount)} oz ${name}`).join(", ")}. How much ${ingredient} goes in the batch?`,
    answer: total,
    unit: "oz",
    tolerance: 0.1,
    solution: [
      `Multiply each ingredient by the number of drinks.`,
      `${String(oz)} oz × ${String(servings)} = ${String(total)} oz of ${ingredient}.`,
    ],
  };
}

function dilution(random: Random): MathProblem {
  const recipe = pick(BATCHES, random);
  const servings = pick([8, 10, 12, 20], random);
  const percent = pick([20, 25], random);
  const perDrink = recipe.parts.reduce((sum, [, oz]) => sum + oz, 0);
  const batch = perDrink * servings;
  const water = batch * (percent / 100);
  return {
    id: `dilution-${recipe.name}-${String(servings)}-${String(percent)}`,
    topic: "Dilution",
    prompt: `A stirred batch of ${String(servings)} ${recipe.name}s (${String(perDrink)} oz each) will be served straight from the freezer, so it needs its dilution added as water. At ${String(percent)}%, how much water do you add?`,
    answer: round(water, 1),
    unit: "oz",
    tolerance: 0.25,
    solution: [
      `Batch size: ${String(perDrink)} oz × ${String(servings)} = ${String(batch)} oz.`,
      `Water: ${String(batch)} oz × ${String(percent / 100)} = ${String(round(water, 1))} oz.`,
      "That stands in for the melt a stir would have added.",
    ],
  };
}

function bottlesNeeded(random: Random): MathProblem {
  const servings = pick([20, 30, 40, 50, 60], random);
  const pour = pick([1.5, 2], random);
  const total = servings * pour;
  const bottles = Math.ceil(total / OZ_PER_750);
  return {
    id: `bottles-${String(servings)}-${String(pour)}`,
    topic: "Bottles needed",
    prompt: `An event needs ${String(servings)} drinks with ${String(pour)} oz of tequila each. How many 750 ml bottles do you pull?`,
    answer: bottles,
    unit: "bottles",
    tolerance: 0,
    solution: [
      `${String(servings)} × ${String(pour)} oz = ${String(total)} oz.`,
      `${String(total)} oz ÷ ${String(OZ_PER_750)} oz a bottle = ${(total / OZ_PER_750).toFixed(2)}.`,
      `Round up: ${String(bottles)} bottles. You can't pour a partial bottle you don't have.`,
    ],
  };
}

function parLevel(random: Random): MathProblem {
  const weekly = pick([4, 6, 8, 9, 10, 12], random);
  const weeks = pick([1, 1.5, 2], random);
  const par = Math.ceil(weekly * weeks);
  const onHand = Math.max(0, par - pick([2, 3, 4, 5], random));
  const order = par - onHand;
  return {
    id: `par-${String(weekly)}-${String(weeks)}-${String(onHand)}`,
    topic: "Par levels",
    prompt: `Your bar goes through ${String(weekly)} bottles of bourbon a week. Par is ${String(weeks)} ${weeks === 1 ? "week" : "weeks"} of stock, and you have ${String(onHand)} on the shelf. How many do you order?`,
    answer: order,
    unit: "bottles",
    tolerance: 0,
    solution: [
      `Par = ${String(weekly)} a week × ${String(weeks)} = ${String(weekly * weeks)}, rounded up to ${String(par)}.`,
      `Order = par − on hand = ${String(par)} − ${String(onHand)} = ${String(order)}.`,
    ],
  };
}

const GENERATORS = [
  pourCost,
  pourCostPercent,
  menuPrice,
  batching,
  dilution,
  bottlesNeeded,
  parLevel,
];

/** A set of problems on different topics, stable for a seed. */
export function makeProblemSet(seed: string): MathProblem[] {
  const random = seededRandom(seed);
  return shuffle(GENERATORS, random)
    .slice(0, PROBLEMS_PER_SET)
    .map((generate) => generate(random));
}

/** Reads what a student typed: "$1.42", "17.5%", "12 oz" and "1,200" all parse. */
export function parseAnswer(input: string): number | undefined {
  const cleaned = input.replace(/[$%,\s]|oz|bottles?/gi, "");
  if (cleaned === "" || !/^-?\d*\.?\d+$/.test(cleaned)) return undefined;
  return Number(cleaned);
}

export function isCorrect(problem: MathProblem, value: number): boolean {
  return Math.abs(value - problem.answer) <= problem.tolerance + 1e-9;
}

export function formatAnswer(problem: MathProblem): string {
  switch (problem.unit) {
    case "$":
      return money(problem.answer);
    case "%":
      return `${String(problem.answer)}%`;
    case "oz":
      return `${String(problem.answer)} oz`;
    case "bottles":
      return `${String(problem.answer)} ${problem.answer === 1 ? "bottle" : "bottles"}`;
  }
}
