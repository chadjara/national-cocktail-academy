# 0004. Curriculum and specs as typed files, validated at build

**Status:** Accepted · 2026-11-21

## Context

With no backend there is no CMS. Content (about 150 lessons, 100 specs, 600 questions) is the
product, so it needs structure, review and integrity guarantees.

## Decision

Content lives in `src/content/` as TypeScript and MDX files with stable slug IDs. Zod schemas
validate every entry, and a referential check (every ingredient, technique and lesson link
resolves) runs in the test suite, so CI fails before broken content can ship.

## Consequences

- Content changes go through pull requests: diffable, reviewable, revertible.
- Updating content needs a developer. That is acceptable for an owner who wants nothing to manage.
- User records reference content IDs. Renames go through a `contentMigrations` map, never a silent
  ID change.
