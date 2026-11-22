import type { Cocktail } from "~/content";

export type NextBottle = { ingredientId: string; unlocks: readonly Cocktail[] };

export type BarAnalysis = {
  canMake: readonly Cocktail[];
  nextBottles: readonly NextBottle[];
};

/** Bottles a spec needs that aren't on the bar. Optional lines never block a drink. */
export function missingBottles(
  cocktail: Cocktail,
  stocked: ReadonlySet<string>,
  isBottle: (ingredientId: string) => boolean,
): string[] {
  const missing = new Set<string>();
  for (const line of cocktail.spec) {
    if (line.optional) continue;
    if (isBottle(line.ingredient) && !stocked.has(line.ingredient)) missing.add(line.ingredient);
  }
  return [...missing];
}

/**
 * What a bar can make right now, and which single bottle would unlock the
 * most new drinks. Citrus, syrups, mixers and pantry items are assumed on
 * hand, as they are in any working bar.
 */
export function analyzeBar(
  cocktails: readonly Cocktail[],
  stocked: ReadonlySet<string>,
  isBottle: (ingredientId: string) => boolean,
  limit = 3,
): BarAnalysis {
  const canMake: Cocktail[] = [];
  const unlocksByBottle = new Map<string, Cocktail[]>();

  for (const cocktail of cocktails) {
    const missing = missingBottles(cocktail, stocked, isBottle);
    if (missing.length === 0) canMake.push(cocktail);
    else if (missing.length === 1) {
      const [bottle] = missing as [string];
      unlocksByBottle.set(bottle, [...(unlocksByBottle.get(bottle) ?? []), cocktail]);
    }
  }

  const nextBottles = [...unlocksByBottle.entries()]
    .map(([ingredientId, unlocks]) => ({ ingredientId, unlocks }))
    .sort(
      (a, b) => b.unlocks.length - a.unlocks.length || a.ingredientId.localeCompare(b.ingredientId),
    )
    .slice(0, limit);

  return { canMake, nextBottles };
}
