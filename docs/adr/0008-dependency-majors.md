# 0008. Pin proven major versions; upgrade deliberately

**Status:** Accepted · 2026-11-21

## Context

At project start, new majors of React Router (8), Vite (8), TypeScript (7) and Vitest (5) had just
shipped. Building a foundation on day-old majors risks undocumented breaking changes and ecosystem
plugins that haven't caught up. That risk already showed up once: `@testing-library/jest-dom@8`
targets a newer Vitest and silently typed `expect` as `any`.

## Decision

Start on the latest release of the previous major for each (React Router 7.18, Vite 7.3,
TypeScript 5.9, Vitest 3.2, ESLint 9). Upgrading a major is its own small PR with its own green CI
run, never bundled with feature work.

## Consequences

- A stable base now, at the cost of a planned upgrade pass later.
- `pnpm audit` runs in CI, so security fixes within a major are never held back.
