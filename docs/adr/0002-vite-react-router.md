# 0002. Vite + React Router 7 instead of Next.js

**Status:** Accepted · 2026-11-21

## Context

The brief defaulted to Next.js App Router. Its distinguishing features (React Server Components,
server actions, middleware, on-demand image optimization, ISR) all need a server. Under
[0001](0001-local-first-static-pwa.md) we have none. `output: "export"` works, but you spend the
project avoiding half the framework.

## Decision

Use Vite with React Router 7 in framework mode, `ssr: false`, prerendering content routes to static
HTML at build time (`src/app/prerender.ts`). Pages that depend on device data prerender their
loading shell and fill in after hydration.

## Consequences

- Content pages are real HTML on first byte: fast LCP and indexable.
- Typed route modules (`+types`), nested layouts, `meta` and `links` without a server.
- Images are optimized by a build step rather than by the framework.
- Hydration discipline matters: anything that reads the device (IndexedDB, localStorage, user agent)
  runs in an effect or `useSyncExternalStore`, never during render.
