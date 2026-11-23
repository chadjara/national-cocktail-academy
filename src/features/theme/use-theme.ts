import { useCallback, useSyncExternalStore } from "react";

import { syncStatusBar } from "~/lib/native";

import {
  applyThemePreference,
  readThemePreference,
  THEME_STORAGE_KEY,
  writeThemePreference,
  type ThemePreference,
} from "./theme";

const CHANGE_EVENT = "academy:theme-change";

function safeLocalStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function subscribe(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => readThemePreference(safeLocalStorage());
// Prerendered HTML can't know the stored choice; the boot script applies it
// before paint, and this hook catches up during hydration.
const getServerSnapshot = (): ThemePreference => "system";

export function useTheme(): {
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
} {
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setPreference = useCallback((next: ThemePreference) => {
    writeThemePreference(safeLocalStorage(), next);
    applyThemePreference(document.documentElement, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    syncStatusBar();
  }, []);

  return { preference, setPreference };
}
