import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  BACKUP_FORMAT,
  eraseProgress,
  exportBackup,
  parseBackup,
  restoreBackup,
  summarizeBackup,
} from "./backup";
import { AcademyDatabase, setDatabaseForTesting } from "./database";

let db: AcademyDatabase;
const at = "2026-11-25T10:00:00.000Z";

async function seed() {
  await db.meta.put({ key: "units", value: "ml" });
  await db.favorites.put({ cocktailId: "negroni", addedAt: at });
  await db.lessonProgress.put({
    id: "sours/daiquiri",
    courseId: "sours",
    lessonId: "daiquiri",
    completedAt: at,
  });
  await db.examAttempts.add({
    courseId: "sours",
    seed: "1",
    questionIds: ["a"],
    score: 9,
    total: 10,
    passed: true,
    topics: [{ lessonId: "daiquiri", right: 9, total: 10 }],
    startedAt: at,
    submittedAt: at,
  });
  await db.capstoneAttempts.add({
    score: 50,
    total: 56,
    unsafe: false,
    passed: true,
    durationMs: 300_000,
    finishedAt: at,
  });
  await db.certificate.put({
    key: "current",
    displayName: "Alex Rivera",
    certificateId: "NCA-ABCD-2345",
    issuedAt: at,
    appVersion: "0.6.0",
  });
}

beforeEach(() => {
  db = new AcademyDatabase(`test-${crypto.randomUUID()}`);
  setDatabaseForTesting(db);
});

afterEach(async () => {
  await db.delete();
});

describe("backup", () => {
  it("round-trips everything through a JSON file", async () => {
    await seed();
    const text = JSON.stringify(await exportBackup());
    await eraseProgress();
    expect(await db.lessonProgress.count()).toBe(0);

    const parsed = parseBackup(text);
    if (!parsed.ok) throw new Error(parsed.reason);
    expect(summarizeBackup(parsed.backup)).toEqual({
      lessons: 1,
      drinks: 0,
      exams: 1,
      certificate: true,
    });
    await restoreBackup(parsed.backup);

    expect(await db.lessonProgress.get("sours/daiquiri")).toBeDefined();
    expect(await db.examAttempts.count()).toBe(1);
    expect((await db.certificate.get("current"))?.certificateId).toBe("NCA-ABCD-2345");
    expect(await db.meta.get("units")).toEqual({ key: "units", value: "ml" });
  });

  it("erasing progress keeps device settings", async () => {
    await seed();
    await eraseProgress();
    expect(await db.meta.get("units")).toEqual({ key: "units", value: "ml" });
    for (const table of [
      db.favorites,
      db.lessonProgress,
      db.examAttempts,
      db.capstoneAttempts,
      db.certificate,
    ]) {
      expect(await table.count()).toBe(0);
    }
  });

  it("rejects foreign, newer and damaged files without changing anything", async () => {
    await seed();
    expect(parseBackup("not json")).toMatchObject({ ok: false });
    expect(parseBackup(JSON.stringify({ format: "something-else", version: 1 }))).toMatchObject({
      ok: false,
    });
    expect(parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 99 }))).toMatchObject({
      ok: false,
      reason: expect.stringContaining("newer version") as string,
    });

    const backup = await exportBackup();
    const damaged = JSON.parse(JSON.stringify(backup)) as {
      tables: { lessonProgress: { completedAt: string }[] };
    };
    const first = damaged.tables.lessonProgress[0];
    if (first) first.completedAt = "yesterday";
    expect(parseBackup(JSON.stringify(damaged))).toMatchObject({ ok: false });
    expect(await db.lessonProgress.count()).toBe(1);
  });
});
