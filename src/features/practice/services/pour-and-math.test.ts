import { describe, expect, it } from "vitest";

import { seededRandom } from "~/lib/rng";

import {
  formatAnswer,
  isCorrect,
  makeProblemSet,
  OZ_PER_750,
  parseAnswer,
  PROBLEMS_PER_SET,
} from "./bar-math";
import {
  calibrate,
  countsFor,
  describeError,
  heldToOz,
  pourTargets,
  readingOptions,
  scorePour,
} from "./pour";

describe("pour trainer", () => {
  it("uses a four-count per ounce", () => {
    expect(countsFor(1.5)).toBe(6);
    expect(countsFor(0.75)).toBe(3);
  });

  it("scores within an eighth and a quarter of an ounce", () => {
    expect(scorePour(1.5, 1.5)).toBe(2);
    expect(scorePour(1.5, 1.625)).toBe(2);
    expect(scorePour(1.5, 1.25)).toBe(1);
    expect(scorePour(1.5, 2)).toBe(0);
  });

  it("converts a hold to ounces with the student's own calibration, ignoring a slip", () => {
    const msPerOz = calibrate([1600, 1650, 1550, 3000]);
    expect(msPerOz).toBe(1600);
    expect(heldToOz(2400, msPerOz)).toBe(1.5);
  });

  it("offers readings around the target and describes the miss", () => {
    expect(readingOptions(0.5)).toEqual([0.25, 0.375, 0.5, 0.625, 0.75, 1]);
    expect(describeError(1, 1, "oz")).toBe("On target");
    expect(describeError(1, 1.25, "oz")).toBe("¼ oz over");
    expect(describeError(1, 0.875, "ml")).toBe("3.8 ml under");
    expect(pourTargets(seededRandom("p"))).toHaveLength(5);
  });
});

describe("bar math", () => {
  it("deals five problems on different topics, each solvable from its own worked solution", () => {
    for (let i = 0; i < 40; i += 1) {
      const set = makeProblemSet(`set-${String(i)}`);
      expect(set).toHaveLength(PROBLEMS_PER_SET);
      expect(new Set(set.map((p) => p.topic)).size).toBe(PROBLEMS_PER_SET);
      for (const problem of set) {
        expect(Number.isFinite(problem.answer)).toBe(true);
        expect(problem.answer).toBeGreaterThan(0);
        expect(problem.solution.length).toBeGreaterThanOrEqual(2);
        expect(isCorrect(problem, problem.answer)).toBe(true);
        expect(parseAnswer(formatAnswer(problem))).toBeCloseTo(problem.answer, 2);
      }
    }
  });

  it("computes pour cost from a 25.4 oz bottle", () => {
    const set = makeProblemSet("x").concat(makeProblemSet("y"), makeProblemSet("z"));
    const pourCost = set.find((p) => p.topic === "Pour cost");
    if (pourCost) {
      const [price = 0, pour = 0] = (pourCost.prompt.match(/\d+(\.\d+)?/g) ?? [])
        .map(Number)
        .filter((n) => n !== 750);
      expect(pourCost.answer).toBeCloseTo(price / (OZ_PER_750 / pour), 2);
    }
  });

  it("reads answers the way people type them", () => {
    expect(parseAnswer("$1.42")).toBe(1.42);
    expect(parseAnswer("17.5%")).toBe(17.5);
    expect(parseAnswer(" 12 oz ")).toBe(12);
    expect(parseAnswer("3 bottles")).toBe(3);
    expect(parseAnswer("1,200")).toBe(1200);
    expect(parseAnswer("abc")).toBeUndefined();
    expect(parseAnswer("")).toBeUndefined();
  });
});
