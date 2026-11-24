import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { progressRepository } from "~/features/learn/repositories/progress-repository";
import { AcademyDatabase, setDatabaseForTesting } from "~/lib/db/database";

import { buildQueue } from "../services/cards";
import { reviewRepository } from "./review-repository";

let db: AcademyDatabase;
const now = new Date("2026-11-24T10:00:00Z");

beforeEach(() => {
  db = new AcademyDatabase(`test-${crypto.randomUUID()}`);
  setDatabaseForTesting(db);
});

afterEach(async () => {
  await db.delete();
});

describe("reviewRepository", () => {
  it("enrolls three cards per drink, once", async () => {
    await reviewRepository.enroll(["negroni"], now);
    await reviewRepository.enroll(["negroni", "daiquiri"], now);
    const ids = (await reviewRepository.list()).map((card) => card.id).sort();
    expect(ids).toEqual([
      "daiquiri:method",
      "daiquiri:service",
      "daiquiri:spec",
      "negroni:method",
      "negroni:service",
      "negroni:spec",
    ]);
  });

  it("enrolls the drinks whose lessons are finished, and nothing from Foundations", async () => {
    await progressRepository.complete("sours", "daiquiri", now);
    await progressRepository.complete("sours", "the-sour-template", now);
    await progressRepository.complete("bar-tools", "your-station", now);
    await reviewRepository.syncFromLessons(now);
    expect(await reviewRepository.enrolledCocktailIds()).toEqual(new Set(["daiquiri"]));
  });

  it("grades a card, pushes it out of today's queue, and logs it", async () => {
    await reviewRepository.enroll(["negroni"], now);
    const updated = await reviewRepository.grade("negroni:spec", "easy", now);
    expect(new Date(updated?.due ?? 0).getTime()).toBeGreaterThan(now.getTime() + 86_400_000);

    const later = new Date(now.getTime() + 60_000);
    const { newCards, reviews } = await reviewRepository.reviewedSince(now);
    expect({ newCards, reviews }).toEqual({ newCards: 1, reviews: 1 });
    const queue = buildQueue(await reviewRepository.list(), later, newCards);
    expect(queue.cards.map((card) => card.id)).not.toContain("negroni:spec");
    expect(queue.newCount).toBe(2);
  });

  it("removes a drink's cards but keeps its history", async () => {
    await reviewRepository.enroll(["negroni"], now);
    await reviewRepository.grade("negroni:spec", "good", now);
    await reviewRepository.unenroll("negroni");
    expect(await reviewRepository.list()).toEqual([]);
    expect(await db.reviewLogs.count()).toBe(1);
  });
});
