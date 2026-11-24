import { describe, expect, it } from "vitest";

import { hashSeed, sample, seededRandom, shuffle } from "./rng";

describe("seeded randomness", () => {
  it("repeats exactly for the same seed and differs across seeds", () => {
    const a = seededRandom("sours/daiquiri");
    const b = seededRandom("sours/daiquiri");
    const c = seededRandom("sours/margarita");
    const first = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(first);
    expect([c(), c(), c()]).not.toEqual(first);
  });

  it("stays in [0, 1)", () => {
    const random = seededRandom(42);
    for (let index = 0; index < 1000; index += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("shuffles without losing or duplicating items", () => {
    const items = ["a", "b", "c", "d", "e"];
    const shuffled = shuffle(items, seededRandom("x"));
    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("samples distinct items", () => {
    const picked = sample([1, 2, 3, 4, 5, 6], 3, seededRandom("y"));
    expect(new Set(picked).size).toBe(3);
  });

  it("hashes stably", () => {
    expect(hashSeed("negroni")).toBe(hashSeed("negroni"));
  });
});
