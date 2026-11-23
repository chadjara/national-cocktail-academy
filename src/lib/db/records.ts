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
