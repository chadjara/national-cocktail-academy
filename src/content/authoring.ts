import type { IngredientId } from "./ingredients";
import type { CocktailInput, Source, SpecLine } from "./schema";

/**
 * Small helpers that keep spec files readable and typo-proof: ingredient ids
 * are checked by TypeScript, so a misspelled id fails the typecheck.
 */

type Extra = { note?: string; optional?: true };

function line(ingredient: IngredientId, amount: SpecLine["amount"], extra?: Extra): SpecLine {
  return {
    ingredient,
    amount,
    ...(extra?.note !== undefined ? { note: extra.note } : {}),
    ...(extra?.optional ? { optional: true } : {}),
  };
}

export const ml = (value: number, ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "ml", value }, extra);
export const dash = (value: number, ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "dash", value }, extra);
export const drop = (value: number, ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "drop", value }, extra);
export const barspoon = (value: number, ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "barspoon", value }, extra);
export const tsp = (value: number, ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "tsp", value }, extra);
export const piece = (value: number, label: string, ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "piece", value, label }, extra);
export const pinch = (ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "pinch" }, extra);
export const fewDrops = (ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "few-drops" }, extra);
export const splash = (ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "splash" }, extra);
export const top = (ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "top" }, extra);
export const toTaste = (ingredient: IngredientId, extra?: Extra) =>
  line(ingredient, { unit: "to-taste" }, extra);

export function defineCocktails(cocktails: CocktailInput[]): CocktailInput[] {
  return cocktails;
}

/**
 * IBA specs were imported from the rasmusab/iba-cocktails dataset (MIT),
 * scraped from the IBA site. Methods and notes are rewritten in our voice.
 */
export const IBA: Source = {
  name: "IBA official cocktail list",
  url: "https://iba-world.com/cocktails/all-cocktails/",
};
