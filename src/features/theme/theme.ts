import { z } from "zod";

export const themePreferenceSchema = z.enum(["system", "light", "dark"]);
export type ThemePreference = z.infer<typeof themePreferenceSchema>;

export const THEME_STORAGE_KEY = "academy.theme";

/**
 * Theme lives in localStorage rather than IndexedDB because it has to be read
 * synchronously before first paint. It is a per-device convenience, so a
 * blocked or empty store simply falls back to the OS preference.
 */
export function readThemePreference(
  storage: Pick<Storage, "getItem"> | undefined,
): ThemePreference {
  try {
    const parsed = themePreferenceSchema.safeParse(storage?.getItem(THEME_STORAGE_KEY));
    return parsed.success ? parsed.data : "system";
  } catch {
    return "system";
  }
}

export function writeThemePreference(
  storage: Pick<Storage, "setItem" | "removeItem"> | undefined,
  preference: ThemePreference,
): void {
  try {
    if (preference === "system") storage?.removeItem(THEME_STORAGE_KEY);
    else storage?.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be unavailable (private mode, blocked site data). The choice
    // still applies for this session through the DOM attribute.
  }
}

export function applyThemePreference(root: HTMLElement, preference: ThemePreference): void {
  if (preference === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", preference);
}

/**
 * Inlined into <head> so the right theme is applied before first paint.
 * Kept dependency-free and tiny; its hash is added to the CSP at build time.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
