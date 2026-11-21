# 0005. FSRS for spaced repetition

**Status:** Accepted · 2026-11-21

## Context

Spec recall is the core daily habit. SM-2 (classic Anki) is simple but schedules poorly for
irregular study, which is exactly how bartenders study between shifts.

## Decision

Use FSRS through `ts-fsrs` (MIT, runs fully offline). Cards are per spec _facet_ (build, glass and
garnish, method), so a student can know a Negroni's ratio and still miss its garnish. A thin
service wraps the library so the scheduler can be swapped or re-tuned without touching UI code.

## Consequences

- Better retention per minute studied than SM-2 at the same review load.
- Review logs are stored, so per-student parameter optimization is possible later.
