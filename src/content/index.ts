import { longDrinks } from "./cocktails/long-drinks";
import { modernSours } from "./cocktails/modern-sours";
import { sours } from "./cocktails/sours";
import { stirred } from "./cocktails/stirred";
import { tropicalSparklingAndMore } from "./cocktails/tropical-sparkling-and-more";
import { ingredients as ingredientList } from "./ingredients";
import {
  BOTTLE_CATEGORIES,
  cocktailSchema,
  ingredientSchema,
  type Cocktail,
  type Ingredient,
} from "./schema";

/**
 * The read-only content API. Everything is parsed once at module load, so
 * defaults are applied and any invalid entry throws during the build.
 */

const cocktails: readonly Cocktail[] = [
  ...sours,
  ...modernSours,
  ...stirred,
  ...longDrinks,
  ...tropicalSparklingAndMore,
]
  .map((entry) => cocktailSchema.parse(entry))
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const ingredients: readonly Ingredient[] = ingredientList.map((entry) =>
  ingredientSchema.parse(entry),
);

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
