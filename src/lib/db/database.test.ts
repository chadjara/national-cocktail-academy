import Dexie from "dexie";
import { describe, expect, it } from "vitest";

import { AcademyDatabase } from "./database";

describe("schema migrations", () => {
  it("upgrades a v1 device to v2 without losing data", async () => {
    const name = `migration-${crypto.randomUUID()}`;

    // A device that installed the M0/M1 release.
    const v1 = new Dexie(name);
    v1.version(1).stores({ meta: "key" });
    await v1.table("meta").put({ key: "units", value: "ml" });
    v1.close();

    const current = new AcademyDatabase(name);
    await current.open();

    expect(current.verno).toBe(2);
    expect(await current.meta.get("units")).toEqual({ key: "units", value: "ml" });
    await current.favorites.put({ cocktailId: "negroni", addedAt: new Date().toISOString() });
    await current.barItems.put({ ingredientId: "gin", addedAt: new Date().toISOString() });
    expect(await current.favorites.count()).toBe(1);
    expect(await current.barItems.count()).toBe(1);

    await current.delete();
  });
});
