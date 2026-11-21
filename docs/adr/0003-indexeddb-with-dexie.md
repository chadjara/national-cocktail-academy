# 0003. IndexedDB via Dexie, with versioned migrations

**Status:** Accepted · 2026-11-21

## Context

We need durable, queryable, reactive storage on the device with real schema migrations. The options
were localStorage (synchronous, about 5 MB, strings only), raw IndexedDB (verbose, hard to get
right) and SQLite/WASM (heavy, OPFS support uneven on iOS).

## Decision

Use Dexie 4 over IndexedDB.

- The schema lives in `src/lib/db/database.ts`. Every change is a new `version(n)` block, and a
  released version is never edited. Each milestone adds its tables, so migrations are exercised
  from the first release.
- Record shapes are Zod schemas (`src/lib/db/records.ts`). The same schemas validate backup imports.
- Only repositories open the database. ESLint forbids importing it from components and routes.
- `useLiveQuery` (`src/lib/db/use-live-query.ts`) subscribes inside an effect, so prerendered HTML
  never touches IndexedDB.

The one exception is the theme preference, which lives in localStorage because it must be read
synchronously before first paint.

## Consequences

- Repositories are tested against `fake-indexeddb`.
- Corrupted or unexpected records read as absent rather than crashing the app.
