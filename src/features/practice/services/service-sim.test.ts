import { describe, expect, it } from "vitest";

import {
  makeShift,
  scoreShift,
  SHIFT_MOMENTS,
  SHIFT_TICKETS,
  type EventResult,
} from "./service-sim";

describe("Service Sim", () => {
  it("deals eight tickets with four guest moments between them", () => {
    for (let i = 0; i < 20; i += 1) {
      const shift = makeShift([], "oz", `shift-${String(i)}`);
      expect(shift.filter((e) => e.kind === "ticket")).toHaveLength(SHIFT_TICKETS);
      expect(shift.filter((e) => e.kind === "moment")).toHaveLength(SHIFT_MOMENTS);
      expect(shift[0]?.kind).toBe("ticket");
      const momentIds = shift.flatMap((e) => (e.kind === "moment" ? [e.moment.id] : []));
      expect(new Set(momentIds).size).toBe(momentIds.length);
    }
  });

  it("is stable for a seed", () => {
    const ids = (seed: string) =>
      makeShift([], "oz", seed)
        .map((e) => (e.kind === "ticket" ? e.ticket.cocktailId : e.moment.id))
        .join(",");
    expect(ids("a")).toBe(ids("a"));
    expect(ids("a")).not.toBe(ids("b"));
  });

  it("passes at 80% with no unsafe choices, and fails on any unsafe choice", () => {
    const shift = makeShift([], "oz", "score");
    const perfect: EventResult[] = shift.map((e) =>
      e.kind === "ticket" ? { kind: "ticket", points: 6 } : { kind: "moment", outcome: "best" },
    );
    expect(scoreShift(shift, perfect)).toMatchObject({
      score: 56,
      total: 56,
      percent: 100,
      passed: true,
      unsafe: false,
    });

    const oneUnsafe = perfect.map((r, i) =>
      r.kind === "moment" && i === perfect.findIndex((x) => x.kind === "moment")
        ? { kind: "moment" as const, outcome: "unsafe" as const }
        : r,
    );
    const failed = scoreShift(shift, oneUnsafe);
    expect(failed.percent).toBeGreaterThanOrEqual(80);
    expect(failed).toMatchObject({ unsafe: true, passed: false });

    const sloppy: EventResult[] = shift.map((e) =>
      e.kind === "ticket" ? { kind: "ticket", points: 3 } : { kind: "moment", outcome: "best" },
    );
    expect(scoreShift(shift, sloppy).passed).toBe(false);
  });
});
