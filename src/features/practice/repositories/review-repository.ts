import { progressRepository } from "~/features/learn/repositories/progress-repository";
import { getDatabase } from "~/lib/db/database";
import {
  reviewCardRecordSchema,
  reviewLogRecordSchema,
  type ReviewCardRecord,
} from "~/lib/db/records";

import { learnedCocktailIds, REVIEW_FACETS, reviewCardId } from "../services/cards";
import { NEW_STATE, newSchedulerState, schedule, type ReviewGrade } from "../services/scheduler";

const gradeValue: Record<ReviewGrade, number> = { again: 1, hard: 2, good: 3, easy: 4 };

export const reviewRepository = {
  /** Every card. Invalid rows are skipped. */
  async list(): Promise<ReviewCardRecord[]> {
    const rows = await getDatabase().reviewCards.toArray();
    return rows.flatMap((row) => {
      const parsed = reviewCardRecordSchema.safeParse(row);
      return parsed.success ? [parsed.data] : [];
    });
  },

  async enrolledCocktailIds(): Promise<Set<string>> {
    return new Set((await this.list()).map((card) => card.cocktailId));
  },

  /** Adds the review cards for these drinks. Cards that already exist keep their history. */
  async enroll(cocktailIds: readonly string[], now: Date = new Date()): Promise<void> {
    if (cocktailIds.length === 0) return;
    const db = getDatabase();
    await db.transaction("rw", db.reviewCards, async () => {
      const ids = cocktailIds.flatMap((cocktailId) =>
        REVIEW_FACETS.map((facet) => ({ cocktailId, facet, id: reviewCardId(cocktailId, facet) })),
      );
      const existing = await db.reviewCards.bulkGet(ids.map(({ id }) => id));
      const missing = ids.filter((_, index) => existing[index] === undefined);
      const scheduler = newSchedulerState(now);
      await db.reviewCards.bulkPut(
        missing.map(({ id, cocktailId, facet }) =>
          reviewCardRecordSchema.parse({
            id,
            cocktailId,
            facet,
            due: scheduler.due,
            addedAt: now.toISOString(),
            scheduler,
          }),
        ),
      );
    });
  },

  /** Removes a drink from Daily Review. Its review history is kept. */
  async unenroll(cocktailId: string): Promise<void> {
    await getDatabase().reviewCards.where("cocktailId").equals(cocktailId).delete();
  },

  /** Enrolls every drink whose lesson the student has finished. */
  async syncFromLessons(now: Date = new Date()): Promise<void> {
    const finished = new Set((await progressRepository.list()).map((row) => row.id));
    await this.enroll(learnedCocktailIds(finished), now);
  },

  /** Grades a card, schedules it, and logs the review. Returns the updated card. */
  async grade(
    cardId: string,
    grade: ReviewGrade,
    now: Date = new Date(),
  ): Promise<ReviewCardRecord | undefined> {
    const db = getDatabase();
    return db.transaction("rw", db.reviewCards, db.reviewLogs, async () => {
      const parsed = reviewCardRecordSchema.safeParse(await db.reviewCards.get(cardId));
      if (!parsed.success) return undefined;
      const card = parsed.data;
      const scheduler = schedule(card.scheduler, grade, now);
      const updated = reviewCardRecordSchema.parse({ ...card, scheduler, due: scheduler.due });
      await db.reviewCards.put(updated);
      await db.reviewLogs.add(
        reviewLogRecordSchema.parse({
          cardId,
          rating: gradeValue[grade],
          state: card.scheduler.state,
          reviewedAt: now.toISOString(),
        }),
      );
      return updated;
    });
  },

  /** How many reviews since a moment, and how many of those introduced a new card. */
  async reviewedSince(since: Date): Promise<{ reviews: number; newCards: number }> {
    const logs = await getDatabase()
      .reviewLogs.where("reviewedAt")
      .aboveOrEqual(since.toISOString())
      .toArray();
    return {
      reviews: logs.length,
      newCards: new Set(logs.filter((log) => log.state === NEW_STATE).map((log) => log.cardId))
        .size,
    };
  },
};
