import { getDatabase } from "~/lib/db/database";
import { lessonProgressRecordSchema, type LessonProgressRecord } from "~/lib/db/records";

export const progressRepository = {
  /** Finished lessons, most recent first. Invalid rows are skipped. */
  async list(): Promise<LessonProgressRecord[]> {
    const rows = await getDatabase().lessonProgress.orderBy("completedAt").reverse().toArray();
    return rows.flatMap((row) => {
      const parsed = lessonProgressRecordSchema.safeParse(row);
      return parsed.success ? [parsed.data] : [];
    });
  },

  /** Marks a lesson finished. Finishing it again keeps the first date. */
  async complete(courseId: string, lessonId: string, at: Date = new Date()): Promise<void> {
    const id = `${courseId}/${lessonId}`;
    const db = getDatabase();
    await db.transaction("rw", db.lessonProgress, async () => {
      if (await db.lessonProgress.get(id)) return;
      await db.lessonProgress.put(
        lessonProgressRecordSchema.parse({ id, courseId, lessonId, completedAt: at.toISOString() }),
      );
    });
  },

  async resetCourse(courseId: string): Promise<void> {
    await getDatabase().lessonProgress.where("courseId").equals(courseId).delete();
  },
};
