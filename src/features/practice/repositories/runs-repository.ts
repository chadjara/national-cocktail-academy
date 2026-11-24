import { getDatabase } from "~/lib/db/database";
import {
  practiceRunRecordSchema,
  type PracticeKind,
  type PracticeRunRecord,
} from "~/lib/db/records";

export const runsRepository = {
  async add(run: Omit<PracticeRunRecord, "id">): Promise<void> {
    await getDatabase().practiceRuns.add(practiceRunRecordSchema.parse(run));
  },

  /** Runs of one kind, most recent first. Invalid rows are skipped. */
  async list(kind: PracticeKind): Promise<PracticeRunRecord[]> {
    const rows = await getDatabase().practiceRuns.where("kind").equals(kind).toArray();
    return rows
      .flatMap((row) => {
        const parsed = practiceRunRecordSchema.safeParse(row);
        return parsed.success ? [parsed.data] : [];
      })
      .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt));
  },
};
