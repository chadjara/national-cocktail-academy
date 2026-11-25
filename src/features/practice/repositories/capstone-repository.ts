import { getDatabase } from "~/lib/db/database";
import { capstoneAttemptRecordSchema, type CapstoneAttemptRecord } from "~/lib/db/records";

export const capstoneRepository = {
  async add(attempt: Omit<CapstoneAttemptRecord, "id">): Promise<void> {
    await getDatabase().capstoneAttempts.add(capstoneAttemptRecordSchema.parse(attempt));
  },

  /** Every finished shift, most recent first. Invalid rows are skipped. */
  async list(): Promise<CapstoneAttemptRecord[]> {
    const rows = await getDatabase().capstoneAttempts.orderBy("finishedAt").reverse().toArray();
    return rows.flatMap((row) => {
      const parsed = capstoneAttemptRecordSchema.safeParse(row);
      return parsed.success ? [parsed.data] : [];
    });
  },
};
