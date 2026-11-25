import { describe, expect, it } from "vitest";

import { summarizeCapstone } from "./use-capstone";

const at = "2026-11-25T10:00:00.000Z";

describe("summarizeCapstone", () => {
  it("counts attempts, remembers any pass, and ranks the best by score then time", () => {
    const status = summarizeCapstone([
      { score: 40, total: 56, unsafe: false, passed: false, durationMs: 300_000, finishedAt: at },
      { score: 50, total: 56, unsafe: false, passed: true, durationMs: 500_000, finishedAt: at },
      { score: 50, total: 56, unsafe: false, passed: true, durationMs: 400_000, finishedAt: at },
      { score: 52, total: 56, unsafe: true, passed: false, durationMs: 200_000, finishedAt: at },
    ]);
    expect(status.attempts).toBe(4);
    expect(status.passed).toBe(true);
    expect(status.best?.score).toBe(52);
    expect(summarizeCapstone([])).toEqual({ attempts: 0, passed: false, best: undefined });
  });
});
