import Dexie from "dexie";
import { describe, expect, it } from "vitest";

import { AcademyDatabase } from "./database";

describe("schema migrations", () => {
  it("upgrades a v1 device to the current version without losing data", async () => {
    const name = `migration-${crypto.randomUUID()}`;

    // A device that installed the M0/M1 release.
    const v1 = new Dexie(name);
    v1.version(1).stores({ meta: "key" });
    await v1.table("meta").put({ key: "units", value: "ml" });
    v1.close();

    const current = new AcademyDatabase(name);
    await current.open();

    expect(current.verno).toBe(5);
    expect(await current.meta.get("units")).toEqual({ key: "units", value: "ml" });
    await current.favorites.put({ cocktailId: "negroni", addedAt: new Date().toISOString() });
    await current.barItems.put({ ingredientId: "gin", addedAt: new Date().toISOString() });
    expect(await current.favorites.count()).toBe(1);
    expect(await current.barItems.count()).toBe(1);

    await current.delete();
  });

  it("upgrades a v2 device to the current version, keeping saved specs and the back bar", async () => {
    const name = `migration-${crypto.randomUUID()}`;

    // A device that installed the M2 release.
    const v2 = new Dexie(name);
    v2.version(1).stores({ meta: "key" });
    v2.version(2).stores({ favorites: "cocktailId, addedAt", barItems: "ingredientId" });
    await v2.table("favorites").put({ cocktailId: "negroni", addedAt: "2026-11-20T10:00:00.000Z" });
    await v2.table("barItems").put({ ingredientId: "gin", addedAt: "2026-11-20T10:00:00.000Z" });
    v2.close();

    const current = new AcademyDatabase(name);
    await current.open();

    expect(current.verno).toBe(5);
    expect(await current.favorites.count()).toBe(1);
    expect(await current.barItems.count()).toBe(1);
    expect(await current.lessonProgress.count()).toBe(0);
    expect(await current.reviewCards.count()).toBe(0);

    await current.delete();
  });

  it("upgrades a v3 device to the current version, keeping finished lessons", async () => {
    const name = `migration-${crypto.randomUUID()}`;

    // A device that installed the M3 release.
    const v3 = new Dexie(name);
    v3.version(1).stores({ meta: "key" });
    v3.version(2).stores({ favorites: "cocktailId, addedAt", barItems: "ingredientId" });
    v3.version(3).stores({ lessonProgress: "id, courseId, completedAt" });
    await v3.table("lessonProgress").put({
      id: "sours/daiquiri",
      courseId: "sours",
      lessonId: "daiquiri",
      completedAt: "2026-11-24T10:00:00.000Z",
    });
    v3.close();

    const current = new AcademyDatabase(name);
    await current.open();

    expect(current.verno).toBe(5);
    expect(await current.lessonProgress.count()).toBe(1);
    expect(await current.reviewCards.count()).toBe(0);
    expect(await current.reviewLogs.count()).toBe(0);
    expect(await current.practiceRuns.count()).toBe(0);

    await current.delete();
  });

  it("upgrades a v4 device to v5, keeping review cards and practice runs", async () => {
    const name = `migration-${crypto.randomUUID()}`;

    // A device that installed the M4 release.
    const v4 = new Dexie(name);
    v4.version(1).stores({ meta: "key" });
    v4.version(2).stores({ favorites: "cocktailId, addedAt", barItems: "ingredientId" });
    v4.version(3).stores({ lessonProgress: "id, courseId, completedAt" });
    v4.version(4).stores({
      reviewCards: "id, due, cocktailId",
      reviewLogs: "++id, cardId, reviewedAt",
      practiceRuns: "++id, kind, finishedAt",
    });
    await v4.table("practiceRuns").add({
      kind: "bar-math",
      score: 4,
      total: 5,
      durationMs: 60_000,
      finishedAt: "2026-11-24T10:00:00.000Z",
    });
    v4.close();

    const current = new AcademyDatabase(name);
    await current.open();

    expect(current.verno).toBe(5);
    expect(await current.practiceRuns.count()).toBe(1);
    expect(await current.examAttempts.count()).toBe(0);

    await current.delete();
  });
});
