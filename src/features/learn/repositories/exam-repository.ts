import { getDatabase } from "~/lib/db/database";
import { examAttemptRecordSchema, type ExamAttemptRecord } from "~/lib/db/records";

export const examRepository = {
  async add(attempt: Omit<ExamAttemptRecord, "id">): Promise<void> {
    await getDatabase().examAttempts.add(examAttemptRecordSchema.parse(attempt));
  },

  /** Every submitted exam, most recent first. Invalid rows are skipped. */
  async list(): Promise<ExamAttemptRecord[]> {
    const rows = await getDatabase().examAttempts.orderBy("submittedAt").reverse().toArray();
    return rows.flatMap((row) => {
      const parsed = examAttemptRecordSchema.safeParse(row);
      return parsed.success ? [parsed.data] : [];
    });
  },
};
