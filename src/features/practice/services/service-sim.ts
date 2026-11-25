import { listGuestMoments, type GuestMoment } from "~/content/service-sim";
import type { ScenarioOutcome } from "~/content/scenarios";
import { sample, seededRandom, shuffle } from "~/lib/rng";

import type { UnitSystem } from "../../library/services/units";
import { makeRound, POINTS_PER_TICKET, type Ticket } from "./speed-round";

export const SHIFT_TICKETS = 8;
export const SHIFT_MOMENTS = 4;
export const PASS_PERCENT = 80;
const MOMENT_POINTS: Record<ScenarioOutcome, number> = { best: 2, acceptable: 1, unsafe: 0 };
export const POINTS_PER_MOMENT = 2;

export type ShiftEvent =
  { kind: "ticket"; ticket: Ticket } | { kind: "moment"; moment: GuestMoment };

export type EventResult =
  { kind: "ticket"; points: number } | { kind: "moment"; outcome: ScenarioOutcome };

/**
 * A shift: eight tickets with four guest moments landing between them, the
 * way interruptions arrive behind a real bar. Never opens with a guest moment.
 */
export function makeShift(
  learned: readonly string[],
  units: UnitSystem,
  seed: string,
): ShiftEvent[] {
  const random = seededRandom(`${seed}/shift`);
  const tickets = makeRound(learned, units, seed, SHIFT_TICKETS);
  const moments = sample(listGuestMoments(), SHIFT_MOMENTS, random);
  // Choose which gaps after tickets 1–7 get a moment.
  const gaps = new Set(shuffle([1, 2, 3, 4, 5, 6, 7], random).slice(0, moments.length));
  const events: ShiftEvent[] = [];
  let next = 0;
  tickets.forEach((ticket, index) => {
    events.push({ kind: "ticket", ticket });
    const moment = moments[next];
    if (gaps.has(index + 1) && moment) {
      events.push({ kind: "moment", moment });
      next += 1;
    }
  });
  return events;
}

export type ShiftScore = {
  score: number;
  total: number;
  percent: number;
  /** True if any guest moment was handled unsafely. */
  unsafe: boolean;
  passed: boolean;
};

/** Pass: 80% or better across tickets and guest moments, and no unsafe choice. */
export function scoreShift(
  events: readonly ShiftEvent[],
  results: readonly EventResult[],
): ShiftScore {
  const total = events.reduce(
    (sum, event) => sum + (event.kind === "ticket" ? POINTS_PER_TICKET : POINTS_PER_MOMENT),
    0,
  );
  let score = 0;
  let unsafe = false;
  for (const result of results) {
    if (result.kind === "ticket") score += result.points;
    else {
      score += MOMENT_POINTS[result.outcome];
      if (result.outcome === "unsafe") unsafe = true;
    }
  }
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  return { score, total, percent, unsafe, passed: !unsafe && percent >= PASS_PERCENT };
}
