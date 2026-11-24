import { z } from "zod";

/**
 * Stored record shapes. These schemas double as the validation layer for
 * backup import, so anything written here must round-trip through JSON.
 */

/** Small device-level settings, one row per key. */
export const metaRecordSchema = z.object({
  key: z.enum(["units"]),
  value: z.string(),
});
export type MetaRecord = z.infer<typeof metaRecordSchema>;
export type MetaKey = MetaRecord["key"];

/** A spec the student saved. Keyed by content id, which never changes. */
export const favoriteRecordSchema = z.object({
  cocktailId: z.string().min(1),
  addedAt: z.iso.datetime(),
});
export type FavoriteRecord = z.infer<typeof favoriteRecordSchema>;

/** A bottle on the student's back bar. Keyed by content ingredient id. */
export const barItemRecordSchema = z.object({
  ingredientId: z.string().min(1),
  addedAt: z.iso.datetime(),
});
export type BarItemRecord = z.infer<typeof barItemRecordSchema>;

/** A lesson the student has finished: every question answered correctly. */
export const lessonProgressRecordSchema = z.object({
  /** `${courseId}/${lessonId}`, both content ids that never change. */
  id: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
  completedAt: z.iso.datetime(),
});
export type LessonProgressRecord = z.infer<typeof lessonProgressRecordSchema>;

/** The facets of a spec that are reviewed separately, so knowing one doesn't hide missing another. */
export const reviewFacetSchema = z.enum(["spec", "service", "method"]);
export type ReviewFacet = z.infer<typeof reviewFacetSchema>;

/** Scheduler state for one card, as stored. Dates are ISO strings so the record round-trips through JSON. */
export const schedulerStateSchema = z.object({
  due: z.iso.datetime(),
  stability: z.number().min(0),
  difficulty: z.number().min(0),
  elapsedDays: z.number().min(0),
  scheduledDays: z.number().min(0),
  learningSteps: z.number().int().min(0),
  reps: z.number().int().min(0),
  lapses: z.number().int().min(0),
  /** 0 new, 1 learning, 2 review, 3 relearning. */
  state: z.number().int().min(0).max(3),
  lastReview: z.iso.datetime().optional(),
});
export type SchedulerState = z.infer<typeof schedulerStateSchema>;

/** One spaced-repetition card: a facet of a drink the student is learning. */
export const reviewCardRecordSchema = z.object({
  /** `${cocktailId}:${facet}`. */
  id: z.string().regex(/^[a-z0-9-]+:(spec|service|method)$/),
  cocktailId: z.string().min(1),
  facet: reviewFacetSchema,
  /** Copied from `scheduler.due` so the queue can be read from an index. */
  due: z.iso.datetime(),
  addedAt: z.iso.datetime(),
  scheduler: schedulerStateSchema,
});
export type ReviewCardRecord = z.infer<typeof reviewCardRecordSchema>;

/** One grading of one card. Kept so the scheduler can be re-tuned to the student later. */
export const reviewLogRecordSchema = z.object({
  id: z.number().int().optional(),
  cardId: z.string().min(1),
  /** 1 again, 2 hard, 3 good, 4 easy. */
  rating: z.number().int().min(1).max(4),
  /** The card's state before this review. */
  state: z.number().int().min(0).max(3),
  reviewedAt: z.iso.datetime(),
});
export type ReviewLogRecord = z.infer<typeof reviewLogRecordSchema>;

/** A finished practice run: a Speed Round, a pour drill or a Bar Math set. */
export const practiceRunRecordSchema = z.object({
  id: z.number().int().optional(),
  kind: z.enum(["speed-round", "pour-timing", "pour-log", "bar-math"]),
  /** Points scored, and the most available. */
  score: z.number().min(0),
  total: z.number().positive(),
  durationMs: z.number().int().min(0),
  finishedAt: z.iso.datetime(),
});
export type PracticeRunRecord = z.infer<typeof practiceRunRecordSchema>;
export type PracticeKind = PracticeRunRecord["kind"];

/** One submitted course exam. */
export const examAttemptRecordSchema = z.object({
  id: z.number().int().optional(),
  courseId: z.string().min(1),
  /** Deals the same questions again, for review. */
  seed: z.string().min(1),
  questionIds: z.array(z.string().min(1)),
  score: z.number().int().min(0),
  total: z.number().int().positive(),
  passed: z.boolean(),
  /** Right and total per lesson: the topic breakdown. */
  topics: z.array(
    z.object({
      lessonId: z.string().min(1),
      right: z.number().int().min(0),
      total: z.number().int().min(1),
    }),
  ),
  startedAt: z.iso.datetime(),
  submittedAt: z.iso.datetime(),
});
export type ExamAttemptRecord = z.infer<typeof examAttemptRecordSchema>;
