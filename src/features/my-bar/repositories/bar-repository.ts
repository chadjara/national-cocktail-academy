import { getDatabase } from "~/lib/db/database";
import { barItemRecordSchema } from "~/lib/db/records";

export const barRepository = {
  async listIds(): Promise<string[]> {
    const rows = await getDatabase().barItems.toArray();
    return rows.flatMap((row) => {
      const parsed = barItemRecordSchema.safeParse(row);
      return parsed.success ? [parsed.data.ingredientId] : [];
    });
  },

  async setStocked(ingredientId: string, stocked: boolean, at: Date = new Date()): Promise<void> {
    const table = getDatabase().barItems;
    if (stocked) {
      await table.put(barItemRecordSchema.parse({ ingredientId, addedAt: at.toISOString() }));
    } else {
      await table.delete(ingredientId);
    }
  },

  async clear(): Promise<void> {
    await getDatabase().barItems.clear();
  },
};
