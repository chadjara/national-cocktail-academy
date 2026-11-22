import { longDrinks } from "./cocktails/long-drinks";
import { modernSours } from "./cocktails/modern-sours";
import { sours } from "./cocktails/sours";
import { stirred } from "./cocktails/stirred";
import { tropicalSparklingAndMore } from "./cocktails/tropical-sparkling-and-more";
import { ingredients as ingredientList } from "./ingredients";
import { BOTTLE_CATEGORIES, type Cocktail, type CocktailInput, type Ingredient } from "./schema";

/**
 * The read-only content API.
 *
 * Content is validated against the Zod schemas in content.test.ts, which runs
 * in CI and blocks a bad spec from shipping. It is deliberately not re-parsed
 * here: that would spend a phone's main thread on every launch re-checking
 * data that cannot change after the build.
 */

/** Applies the schema's defaults without the cost of a full parse. */
export function withDefaults(entry: CocktailInput): Cocktail {
  return { ...entry, techniques: entry.techniques ?? [], variations: entry.variations ?? [] };
}

/** Every authored entry, before defaults. Exported for the schema tests. */
export const rawCocktails: readonly CocktailInput[] = [
  ...sours,
  ...modernSours,
  ...stirred,
  ...longDrinks,
  ...tropicalSparklingAndMore,
];

const cocktails: readonly Cocktail[] = rawCocktails
  .map(withDefaults)
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const ingredients: readonly Ingredient[] = ingredientList;

const cocktailById = new Map(cocktails.map((cocktail) => [cocktail.id, cocktail]));
const ingredientById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

export function listCocktails(): readonly Cocktail[] {
  return cocktails;
}

export function getCocktail(id: string): Cocktail | undefined {
  return cocktailById.get(id);
}

export function listIngredients(): readonly Ingredient[] {
  return ingredients;
}

export function getIngredient(id: string): Ingredient {
  const ingredient = ingredientById.get(id);
  if (!ingredient) throw new Error(`Unknown ingredient: ${id}`);
  return ingredient;
}

/** Bottles a bar stocks. Citrus, syrups, mixers and pantry items are assumed on hand. */
export function isBottle(ingredient: Ingredient): boolean {
  return BOTTLE_CATEGORIES.has(ingredient.category);
}

export function listBottles(): readonly Ingredient[] {
  const used = new Set(cocktails.flatMap((c) => c.spec.map((line) => line.ingredient)));
  return ingredients.filter((ingredient) => isBottle(ingredient) && used.has(ingredient.id));
}

export type { Cocktail, Ingredient } from "./schema";
