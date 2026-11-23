import { appConfig } from "~/config/app.config";
import { getIngredient, type Cocktail } from "~/content";
import { glassLabels, methodLabels } from "~/content/taxonomy";

import { formatAmount, type UnitSystem } from "./units";

/**
 * A spec as a bartender would text it: amounts, method, glass, garnish. NCA is
 * app-only, so there's no web link to share; add the App Store link here once
 * the listing is live.
 */
export function buildShareText(
  cocktail: Cocktail,
  units: UnitSystem,
): { title: string; text: string } {
  const lines = cocktail.spec
    .filter((line) => !line.optional)
    .map((line) => {
      const { quantity, unit } = formatAmount(line.amount, units);
      const name = getIngredient(line.ingredient).name;
      return [quantity, unit, name].filter((part) => part !== "").join(" ");
    });
  const service = `${methodLabels[cocktail.method]}, ${glassLabels[cocktail.glass].toLowerCase()}`;
  const garnish = cocktail.garnish ? ` Garnish: ${cocktail.garnish.toLowerCase()}.` : "";
  return {
    title: cocktail.name,
    text: `${cocktail.name}: ${lines.join(", ")}. ${service}.${garnish} Shared from ${appConfig.academy.name}.`,
  };
}
