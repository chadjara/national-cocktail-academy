import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

import { isNativeApp } from "./platform";

/**
 * Thin wrappers over native features. Each one is safe to call anywhere: on
 * the website it falls back to the web platform or does nothing, and a
 * failing native call never breaks the screen that triggered it.
 */

/** A light tap to confirm an action. iPhone only; the web has no equivalent on iOS. */
export function tapFeedback(): void {
  if (!isNativeApp()) return;
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
}

export type SharePayload = { title: string; text: string };

export function canShare(): boolean {
  return isNativeApp() || (typeof navigator !== "undefined" && "share" in navigator);
}

/** Opens the system share sheet. Returns false if the guest dismissed it or sharing failed. */
export async function share(payload: SharePayload): Promise<boolean> {
  try {
    if (isNativeApp()) await Share.share({ ...payload, dialogTitle: payload.title });
    else await navigator.share(payload);
    return true;
  } catch {
    return false;
  }
}

function prefersDark(): boolean {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark") return true;
  if (explicit === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Matches the status bar text to the current theme. */
export function syncStatusBar(): void {
  if (!isNativeApp()) return;
  // Style.Dark = light text, for dark backgrounds.
  StatusBar.setStyle({ style: prefersDark() ? Style.Dark : Style.Light }).catch(() => undefined);
}

/** Called once the first screen has rendered, so launch never shows a blank web view. */
export function finishLaunch(): void {
  if (!isNativeApp()) return;
  // CI's simulator smoke test waits for this line in the device log to prove
  // the bundle loaded under our CSP and React hydrated inside WKWebView.
  console.info(`[nca] ready ${window.location.pathname}`);
  syncStatusBar();
  SplashScreen.hide({ fadeOutDuration: 200 }).catch(() => undefined);
}
