import { describe, expect, it } from "vitest";

import { getCocktail, getIngredient, isBottle, listCocktails } from "~/content";

import { analyzeBar, missingBottles } from "./bar-analysis";

const bottle = (id: string) => isBottle(getIngredient(id));
const cocktails = listCocktails();
const names = (list: readonly { id: string }[]) => list.map((c) => c.id);

describe("analyzeBar", () => {
  it("makes nothing from an empty bar except drinks with no bottles", () => {
    const { canMake } = analyzeBar(cocktails, new Set(), bottle);
    expect(canMake).toEqual([]);
  });

  it("assumes citrus, syrup and pantry are on hand", () => {
    const { canMake } = analyzeBar(cocktails, new Set(["bourbon"]), bottle);
    expect(names(canMake)).toEqual(
      expect.arrayContaining(["gold-rush", "whiskey-sour", "mint-julep"]),
    );
  });

  it("never lets an optional ingredient block a drink", () => {
    const horsesNeck = getCocktail("horses-neck");
    expect(horsesNeck).toBeDefined();
    if (horsesNeck) expect(missingBottles(horsesNeck, new Set(["cognac"]), bottle)).toEqual([]);
  });

  it("recommends the bottle that unlocks the most drinks", () => {
    const stocked = new Set(["gin", "sweet-vermouth", "bourbon", "rye"]);
    const { nextBottles } = analyzeBar(cocktails, stocked, bottle);
    expect(nextBottles.length).toBeGreaterThan(0);
    const counts = nextBottles.map((b) => b.unlocks.length);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
    const campari = nextBottles.find((b) => b.ingredientId === "campari");
    expect(names(campari?.unlocks ?? [])).toEqual(
      expect.arrayContaining(["negroni", "boulevardier"]),
    );
  });

  it("doesn't recommend a bottle that's already stocked", () => {
    const stocked = new Set(["gin"]);
    const { nextBottles } = analyzeBar(cocktails, stocked, bottle);
    expect(nextBottles.map((b) => b.ingredientId)).not.toContain("gin");
  });
});
