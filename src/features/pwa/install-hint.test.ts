import { describe, expect, it } from "vitest";

import { resolveInstallPlatform } from "./install-hint";

const iphoneSafari =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const iphoneChrome =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0 Mobile/15E148 Safari/604.1";
const ipadDesktopMode =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";
const androidChrome =
  "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36";

const base = {
  maxTouchPoints: 5,
  isInstalled: false,
  isNativeApp: false,
  hasDeferredPrompt: false,
  dismissed: false,
};

describe("resolveInstallPlatform", () => {
  it("explains the Share sheet on iPhone Safari", () => {
    expect(resolveInstallPlatform({ ...base, userAgent: iphoneSafari })).toBe("ios-safari");
  });

  it("treats iPadOS in desktop mode as iOS", () => {
    expect(resolveInstallPlatform({ ...base, userAgent: ipadDesktopMode })).toBe("ios-safari");
  });

  it("says nothing on a Mac, which reports no touch points", () => {
    expect(resolveInstallPlatform({ ...base, userAgent: ipadDesktopMode, maxTouchPoints: 0 })).toBe(
      "none",
    );
  });

  it("says nothing in iOS Chrome, which cannot install web apps", () => {
    expect(resolveInstallPlatform({ ...base, userAgent: iphoneChrome })).toBe("none");
  });

  it("offers the native prompt when the browser provides one", () => {
    expect(
      resolveInstallPlatform({ ...base, userAgent: androidChrome, hasDeferredPrompt: true }),
    ).toBe("prompt");
  });

  it("never suggests installing from inside the iOS app", () => {
    expect(resolveInstallPlatform({ ...base, userAgent: iphoneSafari, isNativeApp: true })).toBe(
      "none",
    );
  });

  it("stays quiet once installed or dismissed", () => {
    expect(resolveInstallPlatform({ ...base, userAgent: iphoneSafari, isInstalled: true })).toBe(
      "none",
    );
    expect(resolveInstallPlatform({ ...base, userAgent: iphoneSafari, dismissed: true })).toBe(
      "none",
    );
  });
});
