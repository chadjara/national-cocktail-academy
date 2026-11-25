import Dexie, { type EntityTable } from "dexie";

import type {
  BarItemRecord,
  CapstoneAttemptRecord,
  CertificateRecord,
  ExamAttemptRecord,
  FavoriteRecord,
  LessonProgressRecord,
  MetaRecord,
  PracticeRunRecord,
  ReviewCardRecord,
  ReviewLogRecord,
} from "./records";

export const DATABASE_NAME = "academy";

/**
 * The on-device database. Every schema change is a new `version()` block;
 * never edit a released one. Each milestone adds its tables here so the
 * migration path is exercised from the very first release.
 */
export class AcademyDatabase extends Dexie {
  meta!: EntityTable<MetaRecord, "key">;
  favorites!: EntityTable<FavoriteRecord, "cocktailId">;
  barItems!: EntityTable<BarItemRecord, "ingredientId">;
  lessonProgress!: EntityTable<LessonProgressRecord, "id">;
  reviewCards!: EntityTable<ReviewCardRecord, "id">;
  reviewLogs!: EntityTable<ReviewLogRecord, "id">;
  practiceRuns!: EntityTable<PracticeRunRecord, "id">;
  examAttempts!: EntityTable<ExamAttemptRecord, "id">;
  capstoneAttempts!: EntityTable<CapstoneAttemptRecord, "id">;
  certificate!: EntityTable<CertificateRecord, "key">;

  constructor(name: string = DATABASE_NAME) {
    super(name);

    // v1 (M0): device settings.
    this.version(1).stores({
      meta: "key",
    });

    // v2 (M2): saved specs and the student's back bar.
    this.version(2).stores({
      favorites: "cocktailId, addedAt",
      barItems: "ingredientId",
    });

    // v3 (M3): finished lessons.
    this.version(3).stores({
      lessonProgress: "id, courseId, completedAt",
    });

    // v4 (M4): spaced-repetition cards and their history, and practice runs.
    this.version(4).stores({
      reviewCards: "id, due, cocktailId",
      reviewLogs: "++id, cardId, reviewedAt",
      practiceRuns: "++id, kind, finishedAt",
    });

    // v5 (M5): submitted course exams.
    this.version(5).stores({
      examAttempts: "++id, courseId, submittedAt",
    });

    // v6 (M6): Service Sim shifts and the Certificate of Completion.
    this.version(6).stores({
      capstoneAttempts: "++id, finishedAt",
      certificate: "key",
    });
  }
}

let instance: AcademyDatabase | undefined;

/**
 * Lazily opened so that build-time prerendering, which has no IndexedDB,
 * never touches it. Only repositories call this.
 */
export function getDatabase(): AcademyDatabase {
  instance ??= new AcademyDatabase();
  return instance;
}

export function setDatabaseForTesting(db: AcademyDatabase): void {
  instance = db;
}
