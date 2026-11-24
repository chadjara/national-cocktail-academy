import { describe, expect, it } from "vitest";

import { schedulerStateSchema } from "~/lib/db/records";

import { formatInterval, newSchedulerState, previewDue, schedule } from "./scheduler";

const now = new Date("2026-11-24T10:00:00Z");

describe("scheduler", () => {
  it("creates a new card due now, in a storable shape", () => {
    const state = newSchedulerState(now);
    expect(state.due).toBe(now.toISOString());
    expect(state.state).toBe(0);
    expect(schedulerStateSchema.safeParse(state).success).toBe(true);
  });

  it("schedules further out for better grades", () => {
    const state = newSchedulerState(now);
    const due = previewDue(state, now);
    expect(due.again.getTime()).toBeLessThan(due.hard.getTime());
    expect(due.hard.getTime()).toBeLessThanOrEqual(due.good.getTime());
    expect(due.good.getTime()).toBeLessThan(due.easy.getTime());
  });

  it("grows the interval with each successful review, and resets it on a lapse", () => {
    let state = newSchedulerState(now);
    let at = now;
    const intervals: number[] = [];
    for (let i = 0; i < 5; i += 1) {
      state = schedule(state, "good", at, { fuzz: false });
      const next = new Date(state.due);
      intervals.push(next.getTime() - at.getTime());
      at = next;
    }
    for (let i = 1; i < intervals.length; i += 1) {
      expect(intervals[i]).toBeGreaterThanOrEqual(intervals[i - 1] ?? 0);
    }
    expect(state.state).toBe(2);
    const lapsed = schedule(state, "again", at, { fuzz: false });
    expect(lapsed.lapses).toBe(1);
    expect(new Date(lapsed.due).getTime() - at.getTime()).toBeLessThan(60 * 60_000);
    expect(schedulerStateSchema.safeParse(lapsed).success).toBe(true);
  });

  it("labels intervals the way a student reads them", () => {
    const at = (ms: number) => new Date(now.getTime() + ms);
    expect(formatInterval(now, at(10 * 60_000))).toBe("10 min");
    expect(formatInterval(now, at(3 * 3_600_000))).toBe("3 h");
    expect(formatInterval(now, at(86_400_000))).toBe("1 day");
    expect(formatInterval(now, at(4 * 86_400_000))).toBe("4 days");
    expect(formatInterval(now, at(62 * 86_400_000))).toBe("2 mo");
  });
});
