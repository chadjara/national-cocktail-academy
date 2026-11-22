import { describe, expect, it } from "vitest";

import snapshot from "./fixtures/iba-ml-snapshot.json";
import {
  getCocktail,
  getIngredient,
  isBottle,
  listBottles,
  listCocktails,
  listIngredients,
  rawCocktails,
  withDefaults,
} from "./index";
import { cocktailSchema, ingredientSchema } from "./schema";

const cocktails = listCocktails();

/** IBA names that differ from ours only in spelling or punctuation. */
const ibaNameToId: Record<string, string> = {
  "Dark ‘n' stormy": "dark-n-stormy",
  KIR: "kir",
  "Last word": "last-word",
  "Lemon drop Martini": "lemon-drop-martini",
  "Long Island Ice Tea": "long-island-iced-tea",
  "Mai-Tai": "mai-tai",
  "Pina Colada": "pina-colada",
  "VE.N.TO": "vento",
  "Vieux Carrè": "vieux-carre",
  "Tommy's Margarita": "tommys-margarita",
  "Bee's Knees": "bees-knees",
  "Horse's Neck": "horses-neck",
  "Planter's Punch": "planters-punch",
  "Corpse Reviver #2": "corpse-reviver-2",
  "Champagne Cocktail": "champagne-cocktail",
};
/** Dropped from the IBA list in its 2024 revision, so we don't teach them. */
const retiredFromIba = new Set(["Golden Dream", "Barracuda", "Yellow Bird"]);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

describe("schema validation (the build gate for content)", () => {
  it.each(rawCocktails.map((entry) => [entry.id, entry] as const))(
    "%s matches the schema",
    (_id, entry) => {
      const parsed = cocktailSchema.parse(entry);
      // The runtime skips parsing, so its defaults must match the schema's exactly.
      expect(withDefaults(entry)).toEqual(parsed);
    },
  );

  it("every ingredient matches the schema", () => {
    for (const ingredient of listIngredients())
      expect(() => ingredientSchema.parse(ingredient)).not.toThrow();
  });
});

describe("content integrity", () => {
  it("has a serious library: at least 100 specs", () => {
    expect(cocktails.length).toBeGreaterThanOrEqual(100);
  });

  it("uses unique ids and names", () => {
    expect(new Set(cocktails.map((c) => c.id)).size).toBe(cocktails.length);
    expect(new Set(cocktails.map((c) => c.name.toLowerCase())).size).toBe(cocktails.length);
    expect(new Set(listIngredients().map((i) => i.id)).size).toBe(listIngredients().length);
  });

  it("resolves every ingredient a spec references", () => {
    for (const cocktail of cocktails) {
      for (const line of cocktail.spec) {
        expect(
          () => getIngredient(line.ingredient),
          `${cocktail.id}: ${line.ingredient}`,
        ).not.toThrow();
      }
    }
  });

  it("cites at least one source for every drink", () => {
    for (const cocktail of cocktails) {
      expect(cocktail.sources.length, cocktail.id).toBeGreaterThan(0);
    }
  });

  it("gives non-IBA drinks at least two independent sources", () => {
    for (const cocktail of cocktails.filter((c) => c.iba === undefined)) {
      const hosts = new Set(cocktail.sources.map((s) => new URL(s.url).hostname));
      expect(hosts.size, cocktail.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("lists variations that point at real specs when they name one", () => {
    const names = new Set(cocktails.map((c) => c.name));
    for (const cocktail of cocktails) {
      for (const variation of cocktail.variations) {
        if (variation.detail.includes("See its own spec")) {
          expect(names.has(variation.name), `${cocktail.id} → ${variation.name}`).toBe(true);
        }
      }
    }
  });

  it("only offers bottles that some spec actually uses", () => {
    const used = new Set(cocktails.flatMap((c) => c.spec.map((l) => l.ingredient)));
    for (const bottle of listBottles()) {
      expect(isBottle(bottle)).toBe(true);
      expect(used.has(bottle.id)).toBe(true);
    }
  });
});

describe("IBA specs match the imported dataset", () => {
  const entries = Object.entries(snapshot.mlAmountsByCocktail).filter(
    ([name]) => !retiredFromIba.has(name),
  );

  it.each(entries)("%s", (name, expectedMl) => {
    const id = ibaNameToId[name] ?? slugify(name);
    const cocktail = getCocktail(id);
    expect(cocktail, `missing IBA drink ${name} (${id})`).toBeDefined();
    expect(cocktail?.iba, `${id} should be tagged IBA`).toBeDefined();
    const actualMl = (cocktail?.spec ?? [])
      .flatMap((line) => (line.amount.unit === "ml" ? [line.amount.value] : []))
      .sort((a, b) => a - b);
    // Every ml amount in the IBA source appears in our spec. We may add measured
    // equivalents (e.g. "1 tablespoon" as tsp), never change a published ml figure.
    for (const value of expectedMl) {
      expect(actualMl, `${id} is missing ${value} ml`).toContain(value);
    }
  });
});
