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

    expect(current.verno).toBe(3);
    expect(await current.meta.get("units")).toEqual({ key: "units", value: "ml" });
    await current.favorites.put({ cocktailId: "negroni", addedAt: new Date().toISOString() });
    await current.barItems.put({ ingredientId: "gin", addedAt: new Date().toISOString() });
    expect(await current.favorites.count()).toBe(1);
    expect(await current.barItems.count()).toBe(1);

    await current.delete();
  });

  it("upgrades a v2 device to v3, keeping saved specs and the back bar", async () => {
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

    expect(current.verno).toBe(3);
    expect(await current.favorites.count()).toBe(1);
    expect(await current.barItems.count()).toBe(1);
    expect(await current.lessonProgress.count()).toBe(0);

    await current.delete();
  });
});
