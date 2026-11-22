import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { barRepository } from "~/features/my-bar/repositories/bar-repository";
import { AcademyDatabase, setDatabaseForTesting } from "~/lib/db/database";

import { favoritesRepository } from "./favorites-repository";
import { unitsRepository } from "./units-repository";

let db: AcademyDatabase;

beforeEach(() => {
  db = new AcademyDatabase(`test-${crypto.randomUUID()}`);
  setDatabaseForTesting(db);
});

afterEach(async () => {
  await db.delete();
});

describe("favoritesRepository", () => {
  it("lists the most recently saved first and removes cleanly", async () => {
    await favoritesRepository.add("negroni", new Date("2026-11-20T10:00:00Z"));
    await favoritesRepository.add("daiquiri", new Date("2026-11-21T10:00:00Z"));
    expect(await favoritesRepository.listIds()).toEqual(["daiquiri", "negroni"]);
    await favoritesRepository.remove("daiquiri");
    expect(await favoritesRepository.listIds()).toEqual(["negroni"]);
  });
});

describe("unitsRepository", () => {
  it("defaults to the configured system and remembers a change", async () => {
    expect(await unitsRepository.get()).toBe("oz");
    await unitsRepository.set("ml");
    expect(await unitsRepository.get()).toBe("ml");
  });

  it("ignores a corrupted value", async () => {
    await db.meta.put({ key: "units", value: "pints" });
    expect(await unitsRepository.get()).toBe("oz");
  });
});

describe("barRepository", () => {
  it("stocks, unstocks and clears bottles", async () => {
    await barRepository.setStocked("gin", true);
    await barRepository.setStocked("campari", true);
    await barRepository.setStocked("gin", false);
    expect(await barRepository.listIds()).toEqual(["campari"]);
    await barRepository.clear();
    expect(await barRepository.listIds()).toEqual([]);
  });
});
