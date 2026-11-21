import { describe, expect, it } from "vitest";

import {
  applyThemePreference,
  readThemePreference,
  THEME_STORAGE_KEY,
  writeThemePreference,
} from "./theme";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    data,
  };
}

const throwingStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

describe("theme preference", () => {
  it("defaults to system when nothing or garbage is stored", () => {
    expect(readThemePreference(memoryStorage())).toBe("system");
    expect(readThemePreference(memoryStorage({ [THEME_STORAGE_KEY]: "neon" }))).toBe("system");
    expect(readThemePreference(undefined)).toBe("system");
  });

  it("round-trips an explicit choice and clears it for system", () => {
    const storage = memoryStorage();
    writeThemePreference(storage, "dark");
    expect(readThemePreference(storage)).toBe("dark");
    writeThemePreference(storage, "system");
    expect(storage.data.has(THEME_STORAGE_KEY)).toBe(false);
  });

  it("survives storage that throws (private mode, blocked site data)", () => {
    expect(readThemePreference(throwingStorage)).toBe("system");
    expect(() => {
      writeThemePreference(throwingStorage, "light");
    }).not.toThrow();
  });

  it("sets and removes the data-theme attribute", () => {
    const root = document.createElement("html");
    applyThemePreference(root, "light");
    expect(root.dataset.theme).toBe("light");
    applyThemePreference(root, "system");
    expect(root.hasAttribute("data-theme")).toBe(false);
  });
});
