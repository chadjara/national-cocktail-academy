import type { Amount } from "~/content/schema";
import { ingredientColors } from "~/content/ingredient-colors";
import type { Cocktail } from "~/content";
import type { DrinkArt, GarnishSprite } from "~/design-system";

/** Rough liquid volume of a spec line, in ml, for color mixing. */
function volume(amount: Amount, ingredient: string): number {
  switch (amount.unit) {
    case "ml":
      return amount.value;
    case "dash":
      return amount.value * 0.8;
    case "drop":
      return amount.value * 0.1;
    case "barspoon":
    case "tsp":
      return amount.value * 5;
    case "piece":
      return ingredient === "espresso" ? 30 : ingredient === "egg-white" ? 25 : 0;
    case "splash":
      return 15;
    case "top":
      return 90;
    case "pinch":
    case "few-drops":
      return 0.5;
    case "to-taste":
      return 1;
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

const CARBONATED = new Set([
  "soda-water",
  "tonic-water",
  "cola",
  "ginger-beer",
  "ginger-ale",
  "grapefruit-soda",
  "champagne",
  "prosecco",
  "sparkling-wine",
]);

/** Reads the garnish line into sprites to draw. Only the first of "x or y" is drawn. */
export function garnishSprites(garnish: string | null): GarnishSprite[] {
  if (!garnish) return [];
  const text = garnish.toLowerCase().split(/\bor\b/)[0] ?? "";
  const sprites: GarnishSprite[] = [];
  const fruit = /grapefruit/.test(text)
    ? "grapefruit"
    : /lime/.test(text)
      ? "lime"
      : /lemon/.test(text)
        ? "lemon"
        : /orange/.test(text)
          ? "orange"
          : undefined;
  if (/salt rim/.test(text)) sprites.push({ kind: "rim", texture: "salt" });
  if (/sugar(ed)? rim/.test(text)) sprites.push({ kind: "rim", texture: "sugar" });
  if (fruit) {
    if (/spiral|long thin|long spiral/.test(text)) sprites.push({ kind: "spiral", fruit });
    else if (/twist|zest|peel/.test(text)) sprites.push({ kind: "twist", fruit });
    else if (/wedge|shell/.test(text)) sprites.push({ kind: "wedge", fruit });
    else if (/wheel/.test(text)) sprites.push({ kind: "wheel", fruit });
    else if (/slice/.test(text))
      sprites.push({ kind: /half/.test(text) ? "half-slice" : "wheel", fruit });
  }
  if (/coffee bean/.test(text)) sprites.push({ kind: "coffee-beans" });
  if (/nutmeg/.test(text)) sprites.push({ kind: "dust" });
  if (/angostura/.test(text)) sprites.push({ kind: "bitters-drops" });
  if (/olive/.test(text)) sprites.push({ kind: "olive" });
  if (/cherr/.test(text)) sprites.push({ kind: "cherry" });
  if (/mint/.test(text)) sprites.push({ kind: "herb", herb: "mint" });
  if (/basil/.test(text)) sprites.push({ kind: "herb", herb: "basil" });
  if (/pineapple/.test(text)) sprites.push({ kind: "pineapple" });
  if (/celery/.test(text)) sprites.push({ kind: "celery" });
  if (/raspberr/.test(text)) sprites.push({ kind: "berries", berry: "raspberry" });
  if (/blackberr/.test(text)) sprites.push({ kind: "berries", berry: "blackberry" });
  if (/chili/.test(text)) sprites.push({ kind: "chili" });
  if (/ginger/.test(text)) sprites.push({ kind: "ginger" });
  return sprites;
}

/**
 * What a drink looks like, worked out from its spec: the glass, the color its
 * ingredients mix to, foam, layers, ice, bubbles and garnish. The illustration
 * is therefore always accurate to the recipe.
 */
export function drinkArt(cocktail: Cocktail): DrinkArt {
  let weight = 0;
  let total = 0;
  const mix: [number, number, number] = [0, 0, 0];
  for (const line of cocktail.spec) {
    const ml = volume(line.amount, line.ingredient);
    const tint = ingredientColors[line.ingredient] ?? { color: "#f4f1e6", strength: 0.05 };
    total += ml;
    const w = ml * tint.strength;
    if (w <= 0) continue;
    const [r, g, b] = hexToRgb(tint.color);
    mix[0] += r * w;
    mix[1] += g * w;
    mix[2] += b * w;
    weight += w;
  }
  const color =
    weight > 0 ? rgbToHex([mix[0] / weight, mix[1] / weight, mix[2] / weight]) : "#f4f1e6";
  // How saturated the drink looks: mostly-clear drinks stay pale.
  const opacity = Math.min(0.95, Math.max(0.18, total > 0 ? (weight / total) * 1.4 : 0.2));

  const ids = new Set(cocktail.spec.map((line) => line.ingredient));
  const shaken = cocktail.method === "shake";
  const foam = ids.has("egg-white")
    ? { color: "#fbf7ee", height: cocktail.id === "ramos-fizz" ? 0.32 : 0.16 }
    : ids.has("espresso") && shaken
      ? { color: "#c9a27a", height: 0.12 }
      : undefined;

  const floatLine = cocktail.techniques.includes("float")
    ? (cocktail.spec.find((line) => line.note?.toLowerCase().includes("float")) ??
      cocktail.spec.at(-1))
    : undefined;
  const top = floatLine
    ? ids.has("cream") && cocktail.id === "irish-coffee"
      ? "#fbf5e6"
      : (ingredientColors[floatLine.ingredient]?.color ?? undefined)
    : undefined;
  const bottom =
    ids.has("grenadine") && cocktail.techniques.includes("layer")
      ? "#b1062c"
      : ids.has("creme-de-mure") && cocktail.id === "bramble"
        ? "#4b1236"
        : undefined;

  return {
    glass: cocktail.glass,
    liquid: { color, opacity },
    ...(foam ? { foam } : {}),
    ...(top ? { topLayer: top } : {}),
    ...(bottom ? { bottomLayer: bottom } : {}),
    ice: cocktail.ice,
    bubbles: [...ids].some((id) => CARBONATED.has(id)),
    garnishes: garnishSprites(cocktail.garnish),
  };
}
