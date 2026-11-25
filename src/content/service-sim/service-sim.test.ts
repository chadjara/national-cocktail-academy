import { describe, expect, it } from "vitest";

import { guestMoments } from "./index";
import { guestMomentSchema } from "./schema";

describe("Service Sim guest moments", () => {
  it("match the schema, with unique ids", () => {
    for (const moment of guestMoments) {
      const result = guestMomentSchema.safeParse(moment);
      expect(result.success, `${moment.id}: ${result.error?.message ?? ""}`).toBe(true);
    }
    expect(new Set(guestMoments.map((m) => m.id)).size).toBe(guestMoments.length);
    expect(guestMoments.length).toBeGreaterThanOrEqual(8);
  });

  it("each have exactly one best response and one unsafe one to learn from", () => {
    for (const moment of guestMoments) {
      const outcomes = moment.choices.map((c) => c.outcome);
      expect(
        outcomes.filter((o) => o === "best"),
        moment.id,
      ).toHaveLength(1);
      expect(outcomes, moment.id).toContain("unsafe");
    }
  });
});
