# 0001. Local-first static PWA, no backend

**Status:** Accepted · 2026-11-21 · Amended by [0009](0009-native-ios-capacitor.md) (iOS app; Apple developer fee)

## Context

The owner's constraints: free to run, no third-party services, nothing to manage after launch, and
it must work on a student's phone. The original brief assumed Postgres, an auth vendor, Stripe, Mux,
S3, Sentry and PostHog. Every one of those means accounts, secrets, bills or upkeep.

## Decision

Ship a static, installable Progressive Web App:

- All student data (progress, reviews, exam attempts, certificate) lives on the device in IndexedDB.
- All content ships in the bundle and is precached by a service worker, so the app works offline
  after the first visit.
- Hosting is GitHub Pages: static files, free, nothing to patch.
- No accounts, no analytics and no tracking. That is a product feature and the app says so.

The app is **free** until the owner decides otherwise. To keep that option cheap, content uses stable
IDs, courses will carry an `access` field (`"free"` for everything today), and data access goes
through repositories. A paid tier, delivered through an App Store wrapper (Capacitor) or a small
backend behind those repositories, can be added without rewriting features.

## Consequences

- **Progress is per device.** We ship backup and restore to a file (M6) and nudge students to use it.
- **iOS evicts storage** for non-installed sites after about 7 days unused. We prompt "Add to Home
  Screen" and request persistent storage once installed.
- **No server-side trust.** Exams and certificates can't be protected from a determined student.
  See [0006](0006-unverifiable-certificates.md).
- **Instructor and admin roles are out.** Content changes are commits.
- No server attack surface; security work focuses on the client ([0007](0007-strict-csp.md)).
