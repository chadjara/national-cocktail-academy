import { z } from "zod";

import { getDatabase } from "./database";
import {
  barItemRecordSchema,
  capstoneAttemptRecordSchema,
  certificateRecordSchema,
  examAttemptRecordSchema,
  favoriteRecordSchema,
  lessonProgressRecordSchema,
  metaRecordSchema,
  practiceRunRecordSchema,
  reviewCardRecordSchema,
  reviewLogRecordSchema,
} from "./records";

/**
 * Backup files: every table, as JSON, validated row by row on the way back in
 * with the same schemas the app writes with. A file that fails anywhere is
 * rejected whole, so a restore can never leave the device half-replaced.
 */

export const BACKUP_FORMAT = "nca-backup";
export const BACKUP_VERSION = 1;

const tableSchemas = {
  meta: metaRecordSchema,
  favorites: favoriteRecordSchema,
  barItems: barItemRecordSchema,
  lessonProgress: lessonProgressRecordSchema,
  reviewCards: reviewCardRecordSchema,
  reviewLogs: reviewLogRecordSchema,
  practiceRuns: practiceRunRecordSchema,
  examAttempts: examAttemptRecordSchema,
  capstoneAttempts: capstoneAttemptRecordSchema,
  certificate: certificateRecordSchema,
} as const;

export type TableName = keyof typeof tableSchemas;
export const TABLE_NAMES = Object.keys(tableSchemas) as TableName[];

/** Tables "Erase all progress" clears. Device settings (units) stay. */
const PROGRESS_TABLES: readonly TableName[] = TABLE_NAMES.filter((name) => name !== "meta");

const backupSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  version: z.number().int(),
  exportedAt: z.iso.datetime(),
  appVersion: z.string(),
  tables: z.object(
    Object.fromEntries(
      TABLE_NAMES.map((name) => [name, z.array(tableSchemas[name]).default([])]),
    ) as {
      [K in TableName]: z.ZodDefault<z.ZodArray<(typeof tableSchemas)[K]>>;
    },
  ),
});

export type Backup = z.infer<typeof backupSchema>;

export async function exportBackup(now: Date = new Date()): Promise<Backup> {
  const db = getDatabase();
  const entries = await Promise.all(
    TABLE_NAMES.map(async (name) => [name, await db.table(name).toArray()] as const),
  );
  return backupSchema.parse({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    appVersion: __APP_VERSION__,
    tables: Object.fromEntries(entries),
  });
}

export type ParsedBackup = { ok: true; backup: Backup } | { ok: false; reason: string };

/** Reads a backup file's text. Never throws; explains what's wrong instead. */
export function parseBackup(text: string): ParsedBackup {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, reason: "This file isn't a National Cocktail Academy backup." };
  }
  const header = z.object({ format: z.string(), version: z.number() }).safeParse(json);
  if (!header.success || header.data.format !== BACKUP_FORMAT) {
    return { ok: false, reason: "This file isn't a National Cocktail Academy backup." };
  }
  if (header.data.version > BACKUP_VERSION) {
    return {
      ok: false,
      reason: "This backup was made by a newer version of the app. Update the app, then try again.",
    };
  }
  const parsed = backupSchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, reason: "This backup is damaged or incomplete, so nothing was changed." };
  }
  return { ok: true, backup: parsed.data };
}

/** Replaces everything on the device with the backup, in one transaction. */
export async function restoreBackup(backup: Backup): Promise<void> {
  const db = getDatabase();
  const tables = TABLE_NAMES.map((name) => db.table(name));
  await db.transaction("rw", tables, async () => {
    for (const name of TABLE_NAMES) {
      const table = db.table(name);
      await table.clear();
      const rows: unknown[] = backup.tables[name];
      if (rows.length > 0) await table.bulkPut(rows);
    }
  });
}

/** Clears all progress: lessons, reviews, practice, exams, the Service Sim and the certificate. */
export async function eraseProgress(): Promise<void> {
  const db = getDatabase();
  const tables = PROGRESS_TABLES.map((name) => db.table(name));
  await db.transaction("rw", tables, async () => {
    await Promise.all(tables.map((table) => table.clear()));
  });
}

/** A short count of what a backup holds, to confirm before restoring. */
export function summarizeBackup(backup: Backup): {
  lessons: number;
  drinks: number;
  exams: number;
  certificate: boolean;
} {
  return {
    lessons: backup.tables.lessonProgress.length,
    drinks: new Set(backup.tables.reviewCards.map((card) => card.cocktailId)).size,
    exams: new Set(backup.tables.examAttempts.filter((a) => a.passed).map((a) => a.courseId)).size,
    certificate: backup.tables.certificate.length > 0,
  };
}

export function backupFileName(now: Date = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return `nca-backup-${local.toISOString().slice(0, 10)}.json`;
}
