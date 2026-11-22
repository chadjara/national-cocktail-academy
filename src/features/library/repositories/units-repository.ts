import { z } from "zod";

import { appConfig } from "~/config/app.config";
import { getDatabase } from "~/lib/db/database";

import type { UnitSystem } from "../services/units";

const unitSystemSchema = z.enum(["oz", "ml"]);

export const unitsRepository = {
  async get(): Promise<UnitSystem> {
    const record = await getDatabase().meta.get("units");
    const parsed = unitSystemSchema.safeParse(record?.value);
    return parsed.success ? parsed.data : appConfig.units.default;
  },

  async set(system: UnitSystem): Promise<void> {
    await getDatabase().meta.put({ key: "units", value: unitSystemSchema.parse(system) });
  },
};
