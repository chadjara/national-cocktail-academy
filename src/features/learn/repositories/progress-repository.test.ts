import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AcademyDatabase, setDatabaseForTesting } from "~/lib/db/database";

import { progressRepository } from "./progress-repository";

let db: AcademyDatabase;

beforeEach(() => {
  db = new AcademyDatabase(`test-${crypto.randomUUID()}`);
  setDatabaseForTesting(db);
});

afterEach(async () => {
  await db.delete();
});

describe("progressRepository", () => {
  it("records finished lessons, newest first, keeping the first finish date", async () => {
    await progressRepository.complete(
      "bar-tools",
      "your-station",
      new Date("2026-11-20T10:00:00Z"),
    );
    await progressRepository.complete("bar-tools", "measuring", new Date("2026-11-21T10:00:00Z"));
    await progressRepository.complete(
      "bar-tools",
      "your-station",
      new Date("2026-11-22T10:00:00Z"),
    );
    const rows = await progressRepository.list();
    expect(rows.map((row) => row.id)).toEqual(["bar-tools/measuring", "bar-tools/your-station"]);
    expect(rows[1]?.completedAt).toBe("2026-11-20T10:00:00.000Z");
  });

  it("resets one course without touching others", async () => {
    await progressRepository.complete("bar-tools", "your-station");
    await progressRepository.complete("sours", "daiquiri");
    await progressRepository.resetCourse("bar-tools");
    expect((await progressRepository.list()).map((row) => row.id)).toEqual(["sours/daiquiri"]);
  });
});
