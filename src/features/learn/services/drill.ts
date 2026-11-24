import { getCocktail, getIngredient, listCocktails, type Cocktail } from "~/content";
import type { Block, DrillFacet, Question } from "~/content/curriculum";
import { glassLabels, iceLabels, methodLabels } from "~/content/taxonomy";
import { hashSeed, sample, seededRandom, shuffle, type Random } from "~/lib/rng";

import { formatAmount, type UnitSystem } from "../../library/services/units";
import { inSentence, withArticle } from "./wording";

type DrillBlock = Extract<Block, { kind: "drill" }>;

export type DrillQuestion = Question & { id: string };

const NO_GARNISH = "No garnish";

/** Jigger-friendly volumes used as wrong answers, so every option is a real pour. */
const POURS: Record<UnitSystem, readonly number[]> = {
  oz: [7.5, 15, 22.5, 30, 45, 60, 75, 90, 120],
  ml: [5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 75, 90, 100, 120],
};

/**
 * Words that identify what a garnish is. Two garnishes that share one (a
 * "lemon twist" and "lemon zest") are never offered against each other, so a
 * question can't hinge on wording.
 */
const GARNISH_WORDS = [
  "lemon",
  "orange",
  "lime",
  "grapefruit",
  "cherr",
  "olive",
  "mint",
  "basil",
  "nutmeg",
  "coffee",
  "salt",
  "sugar",
  "pineapple",
  "celery",
  "ginger",
  "chili",
  "raspberr",
  "blackberr",
  "angostura",
];

function garnishWords(garnish: string): Set<string> {
  const lower = garnish.toLowerCase();
  return new Set(GARNISH_WORDS.filter((word) => lower.includes(word)));
}

function overlaps(a: Set<string>, b: Set<string>): boolean {
  for (const word of a) if (b.has(word)) return true;
  return false;
}

function amountText(value: number, units: UnitSystem): string {
  const { quantity, unit } = formatAmount({ unit: "ml", value }, units);
  return `${quantity} ${unit}`;
}

function question(
  id: string,
  prompt: string,
  correct: string,
  wrong: readonly string[],
  explanation: string,
  random: Random,
): DrillQuestion {
  const options = shuffle([correct, ...wrong], random);
  return { id, prompt, options, answer: options.indexOf(correct), explanation };
}

function glassQuestion(cocktail: Cocktail, random: Random): DrillQuestion {
  const correct = glassLabels[cocktail.glass];
  const others = Object.values(glassLabels).filter((label) => label !== correct);
  return question(
    `${cocktail.id}:glass`,
    `What glass is ${withArticle(cocktail.name)} served in?`,
    correct,
    sample(others, 3, random),
    `${cocktail.name}: ${inSentence(correct)}, ${iceLabels[cocktail.ice].toLowerCase()}.`,
    random,
  );
}

function iceQuestion(cocktail: Cocktail, random: Random): DrillQuestion {
  const correct = iceLabels[cocktail.ice];
  const others = Object.values(iceLabels).filter((label) => label !== correct);
  return question(
    `${cocktail.id}:ice`,
    `What ice does ${withArticle(cocktail.name)} get in the glass?`,
    correct,
    others,
    `${cocktail.name}: ${correct.toLowerCase()}, in ${withArticle(inSentence(glassLabels[cocktail.glass]))}.`,
    random,
  );
}

function methodQuestion(cocktail: Cocktail, random: Random): DrillQuestion {
  const correct = methodLabels[cocktail.method];
  const others = Object.values(methodLabels).filter((label) => label !== correct);
  return question(
    `${cocktail.id}:method`,
    `How is ${withArticle(cocktail.name)} mixed?`,
    correct,
    sample(others, 3, random),
    `${correct}. ${cocktail.steps.join(" ")}`,
    random,
  );
}

function garnishQuestion(cocktail: Cocktail, random: Random): DrillQuestion {
  const correct = cocktail.garnish ?? NO_GARNISH;
  const taken = [garnishWords(correct)];
  const pool = shuffle(
    [...new Set(listCocktails().flatMap((c) => (c.garnish ? [c.garnish] : [])))],
    random,
  );
  const wrong: string[] = [];
  if (cocktail.garnish) wrong.push(NO_GARNISH);
  for (const candidate of pool) {
    if (wrong.length >= 3) break;
    const words = garnishWords(candidate);
    if (words.size === 0 || taken.some((used) => overlaps(used, words))) continue;
    taken.push(words);
    wrong.push(candidate);
  }
  return question(
    `${cocktail.id}:garnish`,
    `What's the garnish on ${withArticle(cocktail.name)}?`,
    correct,
    wrong,
    cocktail.garnish
      ? `Garnish: ${cocktail.garnish}.`
      : `${withArticle(cocktail.name).replace(/^a/, "A")} is served without a garnish.`,
    random,
  );
}

function amountQuestion(
  cocktail: Cocktail,
  units: UnitSystem,
  random: Random,
): DrillQuestion | undefined {
  const measured = cocktail.spec.filter((line) => line.amount.unit === "ml");
  const [line] = sample(measured, 1, random);
  if (!line || line.amount.unit !== "ml") return undefined;
  const value = line.amount.value;
  const correct = amountText(value, units);
  const nearest = [...POURS[units]]
    .filter((pour) => amountText(pour, units) !== correct)
    .sort((a, b) => Math.abs(a - value) - Math.abs(b - value) || random() - 0.5)
    .slice(0, 3);
  const name = getIngredient(line.ingredient).name;
  return question(
    `${cocktail.id}:amount`,
    `How much ${inSentence(name)} goes in ${withArticle(cocktail.name)}?`,
    correct,
    nearest.map((pour) => amountText(pour, units)),
    `The spec is ${correct} ${inSentence(name)}.`,
    random,
  );
}

function ingredientQuestion(cocktail: Cocktail, random: Random): DrillQuestion | undefined {
  const inSpec = cocktail.spec.map((line) => getIngredient(line.ingredient));
  const categories = new Set(inSpec.map((ingredient) => ingredient.category));
  const [correct] = sample(
    inSpec.filter((ingredient) => ingredient.category !== "pantry"),
    1,
    random,
  );
  if (!correct) return undefined;
  const ingredientsOf = (drinks: readonly Cocktail[]) =>
    drinks.flatMap((c) => c.spec.map((line) => getIngredient(line.ingredient)));
  const sameFamily = listCocktails().filter(
    (c) => c.family === cocktail.family && c.id !== cocktail.id,
  );
  // Prefer wrong answers a student might plausibly confuse: ingredients from the same family.
  const elsewhere = [
    ...shuffle(ingredientsOf(sameFamily), random),
    ...shuffle(ingredientsOf(listCocktails()), random),
  ];
  const wrong: string[] = [];
  for (const candidate of elsewhere) {
    if (wrong.length >= 3) break;
    if (categories.has(candidate.category) || wrong.includes(candidate.name)) continue;
    if (candidate.category === "pantry") continue;
    wrong.push(candidate.name);
  }
  return question(
    `${cocktail.id}:ingredient`,
    `Which of these goes into ${withArticle(cocktail.name)}?`,
    correct.name,
    wrong,
    `The spec: ${cocktail.spec.map((line) => inSentence(getIngredient(line.ingredient).name)).join(", ")}.`,
    random,
  );
}

function facetQuestion(
  cocktail: Cocktail,
  facet: DrillFacet,
  units: UnitSystem,
  random: Random,
): DrillQuestion | undefined {
  switch (facet) {
    case "glass":
      return glassQuestion(cocktail, random);
    case "ice":
      return iceQuestion(cocktail, random);
    case "method":
      return methodQuestion(cocktail, random);
    case "garnish":
      return garnishQuestion(cocktail, random);
    case "amount":
      return amountQuestion(cocktail, units, random);
    case "ingredient":
      return ingredientQuestion(cocktail, random);
  }
}

/**
 * Builds a drill's questions from the Library specs. The seed makes a drill
 * stable for one lesson (the same questions on every visit and after a
 * re-render) while still varying from lesson to lesson.
 */
export function drillQuestions(
  block: DrillBlock,
  units: UnitSystem,
  seed: string,
): DrillQuestion[] {
  const random = seededRandom(seed);
  const cocktails = block.cocktailIds.flatMap((id) => {
    const cocktail = getCocktail(id);
    return cocktail ? [cocktail] : [];
  });

  if (block.mode === "every-facet") {
    return cocktails.flatMap((cocktail) =>
      block.facets.flatMap((facet) => facetQuestion(cocktail, facet, units, random) ?? []),
    );
  }

  const offset = hashSeed(seed) % block.facets.length;
  return cocktails.flatMap((cocktail, index) => {
    for (let step = 0; step < block.facets.length; step += 1) {
      const facet = block.facets[(index + offset + step) % block.facets.length];
      const generated = facet && facetQuestion(cocktail, facet, units, random);
      if (generated) return [generated];
    }
    return [];
  });
}

/** Shuffles an authored question's options with a stable seed, keeping track of the answer. */
export function presentQuestion(source: Question, seed: string): Question {
  const correct = source.options[source.answer];
  const options = shuffle(source.options, seededRandom(seed));
  return {
    ...source,
    options,
    answer: correct === undefined ? source.answer : options.indexOf(correct),
  };
}
