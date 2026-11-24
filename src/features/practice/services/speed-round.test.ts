import { describe, expect, it } from "vitest";

import { getIngredient } from "~/content";

import {
  coreCocktailIds,
  formatDuration,
  isBetterRun,
  makeRound,
  scoreTicket,
  TICKETS_PER_ROUND,
} from "./speed-round";

describe("makeRound", () => {
  it("deals a full round of distinct tickets with complete, answerable choices", () => {
    for (let i = 0; i < 30; i += 1) {
      const round = makeRound([], "oz", `round-${String(i)}`);
      expect(round).toHaveLength(TICKETS_PER_ROUND);
      expect(new Set(round.map((t) => t.cocktailId)).size).toBe(TICKETS_PER_ROUND);
      for (const ticket of round) {
        expect(ticket.ingredients.options.length).toBeGreaterThanOrEqual(6);
        const optionIds = ticket.ingredients.options.map((o) => o.id);
        expect(new Set(optionIds).size).toBe(optionIds.length);
        for (const id of ticket.ingredients.correct) expect(optionIds).toContain(id);
        for (const id of ticket.ingredients.correct)
          expect(getIngredient(id).category).not.toBe("pantry");
        for (const choice of Object.values(ticket.choices)) {
          expect(choice.options).toContain(choice.answer);
          expect(choice.options.length).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it("draws from learned drinks once there are enough", () => {
    const learned = ["daiquiri", "negroni", "mojito", "manhattan", "margarita"];
    const round = makeRound(learned, "oz", "learned");
    expect(round.map((t) => t.cocktailId).sort()).toEqual([...learned].sort());
    expect(coreCocktailIds()).toContain("daiquiri");
  });

  it("never offers simple syrup as a wrong answer for a sugar-sweetened drink", () => {
    for (let i = 0; i < 20; i += 1) {
      const [ticket] = makeRound(
        ["daiquiri", "mojito", "old-fashioned", "caipirinha", "mint-julep"],
        "oz",
        `s${String(i)}`,
      );
      expect(ticket?.ingredients.options.map((o) => o.id)).not.toContain("simple-syrup");
    }
  });
});

describe("scoreTicket", () => {
  const [ticket] = makeRound(
    ["negroni", "daiquiri", "mojito", "manhattan", "margarita"],
    "oz",
    "score",
  );
  if (!ticket) throw new Error("no ticket");
  const perfect = {
    ingredients: ticket.ingredients.correct,
    glass: ticket.choices.glass.answer,
    ice: ticket.choices.ice.answer,
    method: ticket.choices.method.answer,
    garnish: ticket.choices.garnish.answer,
  };

  it("gives full marks for a perfect build", () => {
    expect(scoreTicket(ticket, perfect)).toMatchObject({
      points: 6,
      max: 6,
      ingredientsRight: true,
    });
  });

  it("gives partial credit for one ingredient slip and none for two", () => {
    const one = scoreTicket(ticket, {
      ...perfect,
      ingredients: ticket.ingredients.correct.slice(1),
    });
    expect(one.points).toBe(5);
    expect(one.missing).toHaveLength(1);
    const wrongId =
      ticket.ingredients.options.find((o) => !ticket.ingredients.correct.includes(o.id))?.id ?? "";
    const two = scoreTicket(ticket, {
      ...perfect,
      ingredients: [...ticket.ingredients.correct.slice(1), wrongId],
    });
    expect(two.points).toBe(4);
    expect(two.extra).toEqual([wrongId]);
  });

  it("marks each wrong choice", () => {
    const wrongGlass =
      ticket.choices.glass.options.find((o) => o !== ticket.choices.glass.answer) ?? "";
    const result = scoreTicket(ticket, { ...perfect, glass: wrongGlass });
    expect(result.fields.glass).toBe(false);
    expect(result.points).toBe(5);
  });
});

describe("personal bests", () => {
  it("ranks by score, then time", () => {
    expect(isBetterRun({ score: 28, durationMs: 90_000 }, undefined)).toBe(true);
    expect(isBetterRun({ score: 28, durationMs: 90_000 }, { score: 27, durationMs: 60_000 })).toBe(
      true,
    );
    expect(isBetterRun({ score: 28, durationMs: 90_000 }, { score: 28, durationMs: 80_000 })).toBe(
      false,
    );
    expect(formatDuration(95_400)).toBe("1:35");
  });
});
