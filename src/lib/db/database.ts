import Dexie, { type EntityTable } from "dexie";

import type { BarItemRecord, FavoriteRecord, MetaRecord } from "./records";

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
