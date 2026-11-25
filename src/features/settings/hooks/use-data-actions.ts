import { useCallback } from "react";

import {
  backupFileName,
  eraseProgress,
  exportBackup,
  parseBackup,
  restoreBackup,
  type ParsedBackup,
  type Backup,
} from "~/lib/db/backup";
import { saveFile } from "~/lib/files";

/** Backup, restore and erase, for the Your data screen. */
export function useDataActions(): {
  saveBackup: () => Promise<boolean>;
  readBackup: (file: File) => Promise<ParsedBackup>;
  restore: (backup: Backup) => Promise<void>;
  erase: () => Promise<void>;
} {
  const saveBackup = useCallback(async () => {
    const backup = await exportBackup();
    const bytes = new TextEncoder().encode(JSON.stringify(backup, null, 2));
    return saveFile(backupFileName(), bytes, "application/json");
  }, []);
  const readBackup = useCallback(async (file: File) => parseBackup(await file.text()), []);
  const restore = useCallback((backup: Backup) => restoreBackup(backup), []);
  const erase = useCallback(() => eraseProgress(), []);
  return { saveBackup, readBackup, restore, erase };
}
