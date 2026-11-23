# 0009. Native iOS app via Capacitor, built and signed in CI

**Status:** Accepted · 2026-11-23 · Amends [0001](0001-local-first-static-pwa.md)

## Context

The owner wants Proof on TestFlight, on the way to an App Store listing. They are enrolled in the
Apple Developer Program and have no Mac. That enrollment changes one line of ADR 0001: the product
is still free to run, apart from Apple's $99/year developer fee, which the owner chose.

## Decision

- **Wrap the existing static build in Capacitor 8.** One build serves the website and the app;
  `isNativeApp()` (`src/lib/platform.ts`) switches the few behaviours that differ. The whole app
  ships inside the binary and loads nothing from the network, which keeps it fully offline and
  answers App Store guideline 4.2's concern about repackaged websites.
- **Use the Swift Package Manager template**, so there's no CocoaPods. `ios/` is committed; the web
  build synced into it is not.
- **Native touches that earn their place:**
  - haptic feedback on save, stock and unit changes
  - the system share sheet for specs
  - a themed status bar and launch screen
  - local practice reminders, which arrive with the practice engine (M4)
- **Build in GitHub Actions on macOS** (free for public repos).
  - `ios.yml` builds for the simulator and launches the app on every relevant PR. It waits for the
    web app's `[proof] ready` log line, which is the only real WebKit check of the CSP and native
    bridge.
  - `testflight.yml` archives and uploads.
- **Apple cloud-managed signing** with an App Store Connect API key (Admin role), stored as
  repository secrets. No certificates or profiles live in the repo or on anyone's machine.

## Consequences

- **The service worker and install hint are disabled in the app**, where they make no sense.
- **Persistent storage is no longer a risk in the app.** App storage isn't subject to Safari's
  7-day eviction.
- **Every TestFlight build is reproducible from a commit.** The build number is the workflow's run
  number; the version comes from `package.json`.
- **Store review risks remain.** These are guideline 4.2 and the 18+ age rating for alcohol content.
  The learning features in M3 to M5 are what make the app clearly more than a recipe site.
