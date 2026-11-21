import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AcademyDatabase, setDatabaseForTesting } from "./database";
import { installHintRepository } from "./meta-repository";

let db: AcademyDatabase;

beforeEach(() => {
  db = new AcademyDatabase(`test-${crypto.randomUUID()}`);
  setDatabaseForTesting(db);
});

afterEach(async () => {
  await db.delete();
});

describe("installHintRepository", () => {
  it("reads as not dismissed on a fresh device", async () => {
    expect(await installHintRepository.getDismissedAt()).toBeUndefined();
  });

  it("remembers a dismissal", async () => {
    const at = new Date("2026-11-21T22:15:00.000Z");
    await installHintRepository.markDismissed(at);
    expect(await installHintRepository.getDismissedAt()).toBe(at.toISOString());
  });

  it("treats a corrupted value as absent instead of crashing", async () => {
    await db.meta.put({ key: "installHintDismissedAt", value: "last tuesday" });
    expect(await installHintRepository.getDismissedAt()).toBeUndefined();
  });
});
