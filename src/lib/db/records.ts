import { z } from "zod";

/**
 * Stored record shapes. These schemas double as the validation layer for
 * backup import, so anything written here must round-trip through JSON.
 */

/** Small device-level settings, one row per key. */
export const metaRecordSchema = z.object({
  key: z.enum(["installHintDismissedAt"]),
  value: z.string(),
});
export type MetaRecord = z.infer<typeof metaRecordSchema>;
export type MetaKey = MetaRecord["key"];
