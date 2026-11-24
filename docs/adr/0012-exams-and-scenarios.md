# 0012. Course exams and Responsible Service scenarios

**Status:** Accepted · 2026-11-24

## Context

M5 adds assessment. A student who finishes a course should be able to prove it, and the
Responsible Service material should be practiced as decisions, not only read. The owner decided:

- a course's exam unlocks only once its lessons are finished
- a failed exam can be retaken right away
- a Spirits & Products course is added in this milestone

## Decision

### Exams

- **The question pool is drawn from the course itself.** It combines every authored question
  in the course with generated questions on every facet of every drink its drills cover, using
  the same generator as the lessons ([0011](0011-curriculum-from-library-data.md)).
- **An exam is 10 questions**, or the whole pool if it's smaller. Questions are dealt from each
  lesson in turn, so every part of the course is covered, then shuffled. Each attempt uses a new
  seed, so a retake is a new set.
- **No feedback until the exam is submitted.** Results show the score, pass or fail against
  `appConfig.assessment.passMarkPercent` (80), a breakdown by lesson with links back to any
  lesson with a miss, and every missed question with its answer and explanation.
- **The exam unlocks after every lesson in the course is finished.**
- **Retakes are immediate:** `retakeCooldownHours` is 0. The engine still honors a cooldown if
  the setting is ever raised.
- **Storage:** attempts go in Dexie v5 `examAttempts`. "Passed" means any attempt passed; the
  best and latest scores are derived from the stored attempts.

### Scenarios

- **Scenarios are branching content** in `src/content/scenarios`, played from a `scenario`
  lesson block. Every choice is weighted `best`, `acceptable` or `unsafe` and carries feedback.
- **An unsafe choice ends the scenario and it must be replayed.** A lesson completes once every
  scenario in it has been finished without an unsafe choice.
- **Graph tests** check that every link resolves, every node is reachable, every path ends, and
  each decision has exactly one best response.
- **Wording teaches only what every state shares:** check valid ID; never serve anyone under 21
  or anyone visibly intoxicated; refuse calmly and privately; offer water, food and a safe ride;
  involve the manager. Anything state-specific is flagged as varying. The app is education, not
  a state server certification.

### Content accuracy

Spirits content uses legal definitions (the US standards of identity, and the Mexican,
Scottish, Irish and French rules for their spirits) and facts every reference agrees on. Where
practice varies by bar or brand, the lesson says so. This follows the owner's correction of the
build-order lesson.

## Consequences

- An exam can't drift from what the course teaches, because both use the same source.
- Small courses, such as Service, have short exams that use their whole pool.
- Scenarios don't appear in exams. They are practiced in place, where the reasoning behind each
  choice is shown.
