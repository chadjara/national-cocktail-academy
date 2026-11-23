# 0010. App-only distribution

**Status:** Accepted · 2026-11-23 · Supersedes the public-website parts of
[0001](0001-local-first-static-pwa.md) and the prerendering rationale in
[0002](0002-vite-react-router.md)

## Context

The owner wants people to use the NCA iPhone app, not a website. Until now the same build was also
published on GitHub Pages as an installable web app. That required a service worker, an "Add to
Home Screen" tip, a web manifest and icons, GitHub Pages fallbacks, base-path handling, prerendered
HTML for search engines, and share links that pointed at the site.

## Decision

- **NCA ships only as the iOS app** ([0009](0009-native-ios-capacitor.md)). The Pages deploy
  workflow is removed and the site is unpublished.
- **The app is built as a single-page bundle.** `ssr: false` with no prerendering emits one
  `index.html` that renders any route on the device, which is how Capacitor loads it. A blank
  `HydrateFallback` in the canvas color covers the first frame, behind the launch screen.
- **Website-only code is deleted:**
  - service worker and update prompt
  - persistent-storage request
  - install hint and its stored flag
  - manifest and web icons
  - GitHub Pages `404.html`, `.nojekyll` and base-path hoisting
  - `workbox-build`
- **Shared specs are plain text.** An App Store link will be added once the listing is live.
- **Still in place:**
  - The Content Security Policy ([0007](0007-strict-csp.md)) still applies inside the app.
  - The local preview server (`pnpm preview`) serves the build the way the app loads it. Browser
    tests and Lighthouse run against it as a fast proxy for the app's UI.
  - The iOS simulator launch check runs in real WebKit.
- **The privacy policy covers the app only.** It is hosted by the publisher at
  `cjaratech.com/national-cocktail-academy/privacy` and mirrored word for word in the app.

## Consequences

- One product to support. Offline is inherent, because every file is inside the binary.
- **Smaller app.** The build dropped from about 4 MB, with 110 prerendered HTML pages, to about
  1.4 MB.
- **No web discovery or browser access.** Anyone without an iPhone can't use NCA until an Android
  build exists, which would also use Capacitor.
