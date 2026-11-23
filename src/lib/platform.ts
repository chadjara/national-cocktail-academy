import { Capacitor } from "@capacitor/core";

/**
 * True inside the iOS app (Capacitor), false on the website. One build
 * serves both; behaviour that only makes sense in one place checks this.
 */
export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}
