import { appConfig } from "~/config/app.config";
import type { Amount } from "~/content/schema";

export type UnitSystem = "oz" | "ml";

/** Fractions a bartender actually reads off a jigger. */
const FRACTIONS: ReadonlyArray<readonly [number, string]> = [
  [0, ""],
  [1 / 8, "⅛"],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [3 / 8, "⅜"],
  [1 / 2, "½"],
  [5 / 8, "⅝"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
  [7 / 8, "⅞"],
  [1, ""],
];

/** Within this many ml we call it exact; beyond it we prefix "≈". */
const EXACT_TOLERANCE_ML = 0.6;

/**
 * Converts ml to an ounce string using the bar convention of 30 ml per oz,
 * so 22.5 ml reads ¾ oz and 45 ml reads 1½ oz.
 */
export function mlToOz(ml: number, mlPerOz: number = appConfig.units.mlPerOz): string {
  const oz = ml / mlPerOz;
  let whole = Math.floor(oz);
  const remainder = oz - whole;

  let best: readonly [number, string] = [0, ""];
  for (const fraction of FRACTIONS) {
    if (Math.abs(fraction[0] - remainder) < Math.abs(best[0] - remainder)) best = fraction;
  }
  if (best[0] === 1) whole += 1;

  const approximate = Math.abs(best[0] - remainder) * mlPerOz > EXACT_TOLERANCE_ML;
  const text = `${whole > 0 ? String(whole) : ""}${best[1]}` || "0";
  return approximate ? `≈ ${text}` : text;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function formatSpoon(value: number): string {
  if (value === 0.25) return "¼";
  if (value === 0.5) return "½";
  return formatNumber(value);
}

/** Fractions read singular: "½ barspoon", "1 dash", "2 dashes". */
function plural(value: number, one: string, many: string): string {
  return value <= 1 ? one : many;
}

export type FormattedAmount = { quantity: string; unit: string };

/** Formats any spec amount for display. Non-volumetric units read the same in oz and ml. */
export function formatAmount(amount: Amount, system: UnitSystem): FormattedAmount {
  switch (amount.unit) {
    case "ml":
      return system === "oz"
        ? { quantity: mlToOz(amount.value), unit: "oz" }
        : { quantity: formatNumber(amount.value), unit: "ml" };
    case "dash":
      return { quantity: formatNumber(amount.value), unit: plural(amount.value, "dash", "dashes") };
    case "drop":
      return { quantity: formatNumber(amount.value), unit: plural(amount.value, "drop", "drops") };
    case "barspoon":
      return {
        quantity: formatSpoon(amount.value),
        unit: plural(amount.value, "barspoon", "barspoons"),
      };
    case "tsp":
      return { quantity: formatSpoon(amount.value), unit: "tsp" };
    case "piece":
      // The description ("mint leaves", "quarter-size slices") reads under the
      // ingredient name; the amount column stays a clean number.
      return { quantity: formatNumber(amount.value), unit: "" };
    case "pinch":
      return { quantity: "", unit: "Pinch" };
    case "few-drops":
      return { quantity: "", unit: "Few drops" };
    case "splash":
      return { quantity: "", unit: "Splash" };
    case "top":
      return { quantity: "", unit: "Top" };
    case "to-taste":
      return { quantity: "", unit: "To taste" };
  }
}

/** Total of the measured liquid in a spec, for "how big is this drink" at a glance. */
export function totalMl(amounts: readonly Amount[]): number {
  return amounts.reduce((sum, amount) => sum + (amount.unit === "ml" ? amount.value : 0), 0);
}
