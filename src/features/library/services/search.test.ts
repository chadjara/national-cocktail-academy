import { describe, expect, it } from "vitest";

import { listCocktails } from "~/content";

import {
  activeFilterCount,
  createCocktailSearch,
  emptyFilters,
  filtersFromSearchParams,
  filtersToSearchParams,
} from "./search";

const search = createCocktailSearch(listCocktails());
const ids = (filters: Parameters<typeof search>[0]) => search(filters).map((c) => c.id);

describe("cocktail search", () => {
  it("returns everything, alphabetically, with no query or filters", () => {
    const all = search(emptyFilters);
    expect(all).toHaveLength(listCocktails().length);
    expect(all[0]?.name.localeCompare(all[1]?.name ?? "")).toBeLessThanOrEqual(0);
  });

  it("ranks a name match first", () => {
    expect(ids({ ...emptyFilters, q: "negroni" })[0]).toBe("negroni");
  });

  it("tolerates typos and partial words", () => {
    expect(ids({ ...emptyFilters, q: "negorni" })).toContain("negroni");
    expect(ids({ ...emptyFilters, q: "daiq" })).toContain("daiquiri");
  });

  it("finds drinks by ingredient", () => {
    const results = ids({ ...emptyFilters, q: "chartreuse" });
    expect(results).toEqual(
      expect.arrayContaining(["last-word", "naked-and-famous", "greenpoint"]),
    );
  });

  it("ANDs across filter groups and ORs within one", () => {
    const stirredGinOrWhiskey = search({
      ...emptyFilters,
      base: ["gin", "whiskey"],
      method: ["stir"],
    });
    expect(stirredGinOrWhiskey.length).toBeGreaterThan(0);
    for (const cocktail of stirredGinOrWhiskey) {
      expect(["gin", "whiskey"]).toContain(cocktail.base);
      expect(cocktail.method).toBe("stir");
    }
  });

  it("combines text and filters", () => {
    expect(ids({ ...emptyFilters, q: "campari", base: ["gin"] })).toContain("negroni");
    expect(ids({ ...emptyFilters, q: "campari", base: ["gin"] })).not.toContain("boulevardier");
  });
});

describe("filters in the URL", () => {
  it("round-trips", () => {
    const filters = {
      q: "sour",
      base: ["gin" as const],
      family: ["sour" as const],
      method: ["shake" as const],
      difficulty: [3 as const],
    };
    expect(filtersFromSearchParams(filtersToSearchParams(filters))).toEqual(filters);
    expect(activeFilterCount(filters)).toBe(4);
  });

  it("drops values it doesn't recognise instead of failing", () => {
    const params = new URLSearchParams("base=gin&base=absinthe&difficulty=9&method=shake&x=1");
    expect(filtersFromSearchParams(params)).toEqual({
      ...emptyFilters,
      base: ["gin"],
      method: ["shake"],
    });
  });
});
