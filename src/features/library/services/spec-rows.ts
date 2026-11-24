import { getIngredient, type Cocktail } from "~/content";
import type { SpecRow } from "~/design-system";

import { formatAmount, type UnitSystem } from "./units";

/** A cocktail's spec as display rows, in the student's units. */
export function specRows(cocktail: Cocktail, units: UnitSystem): SpecRow[] {
  return cocktail.spec.map((line) => ({
    ...formatAmount(line.amount, units),
    name: getIngredient(line.ingredient).name,
    note:
      [line.amount.unit === "piece" ? line.amount.label : undefined, line.note]
        .filter(Boolean)
        .join(", ") || undefined,
    optional: line.optional,
  }));
}
