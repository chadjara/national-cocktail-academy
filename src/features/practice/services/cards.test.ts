import { describe, expect, it } from "vitest";

import type { ReviewCardRecord } from "~/lib/db/records";

import { buildQueue, learnedCocktailIds } from "./cards";
import { newSchedulerState } from "./scheduler";

const now = new Date("2026-11-24T10:00:00Z");

function card(id: string, { state = 0, due = now.toISOString() } = {}): ReviewCardRecord {
  const [cocktailId = "", facet = "spec"] = id.split(":");
  return {
    id,
    cocktailId,
    facet: facet as ReviewCardRecord["facet"],
    due,
    addedAt: now.toISOString(),
    scheduler: { ...newSchedulerState(now), state, due },
  };
}

describe("buildQueue", () => {
  it("puts due reviews first, oldest first, and leaves future cards out", () => {
    const queue = buildQueue(
      [
        card("a:spec", { state: 2, due: "2026-11-23T10:00:00.000Z" }),
        card("b:spec", { state: 2, due: "2026-11-20T10:00:00.000Z" }),
        card("c:spec", { state: 2, due: "2026-11-30T10:00:00.000Z" }),
        card("d:spec"),
      ],
      now,
      0,
    );
    expect(queue.cards.map((c) => c.id)).toEqual(["b:spec", "a:spec", "d:spec"]);
    expect(queue).toMatchObject({ dueCount: 2, newCount: 1 });
  });

  it("caps new cards per day, counting the ones already started", () => {
    const fresh = Array.from({ length: 20 }, (_, i) =>
      card(`drink-${String(i).padStart(2, "0")}:spec`),
    );
    expect(buildQueue(fresh, now, 0, 15).newCount).toBe(15);
    expect(buildQueue(fresh, now, 12, 15).newCount).toBe(3);
    expect(buildQueue(fresh, now, 20, 15).newCount).toBe(0);
  });
});

describe("learnedCocktailIds", () => {
  it("collects drinks from finished drink lessons only", () => {
    expect(
      learnedCocktailIds(new Set(["sours/daiquiri", "sours/review", "highballs/spirit-and-mixer"])),
    ).toEqual(["daiquiri"]);
  });
});
