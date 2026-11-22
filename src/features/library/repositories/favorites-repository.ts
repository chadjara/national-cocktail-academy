import { getDatabase } from "~/lib/db/database";
import { favoriteRecordSchema } from "~/lib/db/records";

export const favoritesRepository = {
  /** Saved spec ids, most recently saved first. Invalid rows are skipped. */
  async listIds(): Promise<string[]> {
    const rows = await getDatabase().favorites.orderBy("addedAt").reverse().toArray();
    return rows.flatMap((row) => {
      const parsed = favoriteRecordSchema.safeParse(row);
      return parsed.success ? [parsed.data.cocktailId] : [];
    });
  },

  async add(cocktailId: string, at: Date = new Date()): Promise<void> {
    await getDatabase().favorites.put(
      favoriteRecordSchema.parse({ cocktailId, addedAt: at.toISOString() }),
    );
  },

  async remove(cocktailId: string): Promise<void> {
    await getDatabase().favorites.delete(cocktailId);
  },
};
