export type InstallPlatform = "ios-safari" | "prompt" | "none";

/**
 * Decides how (or whether) to suggest installing the app.
 *
 * - Installed already, or dismissed: say nothing.
 * - iOS Safari has no install API, so we explain the Share-sheet steps.
 * - Chromium browsers fire `beforeinstallprompt`, so we offer a button.
 */
export function resolveInstallPlatform(input: {
  userAgent: string;
  maxTouchPoints: number;
  isInstalled: boolean;
  hasDeferredPrompt: boolean;
  dismissed: boolean;
}): InstallPlatform {
  if (input.isInstalled || input.dismissed) return "none";
  if (input.hasDeferredPrompt) return "prompt";

  const ua = input.userAgent;
  const isIOSDevice =
    /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && input.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  if (isIOSDevice && isSafari) return "ios-safari";

  return "none";
}
