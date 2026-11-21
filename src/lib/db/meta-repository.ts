import { z } from "zod";

import { getDatabase } from "./database";
import { type MetaKey } from "./records";

const timestamp = z.iso.datetime();

async function readTimestamp(key: MetaKey): Promise<string | undefined> {
  const record = await getDatabase().meta.get(key);
  const parsed = timestamp.safeParse(record?.value);
  return parsed.success ? parsed.data : undefined;
}

async function writeTimestamp(key: MetaKey, value: Date): Promise<void> {
  await getDatabase().meta.put({ key, value: value.toISOString() });
}

export const installHintRepository = {
  getDismissedAt: () => readTimestamp("installHintDismissedAt"),
  markDismissed: (at: Date = new Date()) => writeTimestamp("installHintDismissedAt", at),
};
