# 0011. Courses are authored, drills are generated from the Library

**Status:** Accepted · 2026-11-24

## Context

M3 turns NCA from a spec library into a training program. A student should finish knowing how to use
every bar tool, which glass and garnish each drink takes, and the classic specs family by family.
That is a lot of questions. If they were all written by hand, a spec corrected in the Library could
easily be taught one way in a lesson and quizzed another.

## Decision

- **Courses are typed content** in `src/content/curriculum/` ([0004](0004-content-as-typed-files.md)).
  A lesson is a list of blocks: text, key points, tips and warnings, numbered steps, tools, glasses,
  a live spec, an authored question, or a drill.
- **Teaching and judgment are authored.** Why a Martini is stirred, how to break a Boston shaker,
  when to burn the ice: an editor writes these, with their questions.
- **Spec facts are generated.** A `drill` block names drinks and facets (glass, ice, method,
  garnish, amount, ingredient). `features/learn/services/drill.ts` builds the questions from the
  same Library entry the spec card shows, so the course and the Library can never disagree.
  - Wrong answers are real: jigger-sized pours in the student's units, and garnishes that don't
    share a key word with the right one ("lemon twist" is never offered against "lemon zest").
  - A seeded generator ([`lib/rng.ts`](../../src/lib/rng.ts)) keeps a lesson's questions and option
    order the same on every visit. Authored options are shuffled the same way, so the right answer
    is never in a predictable place.
- **Family courses are assembled**: an authored introduction, one lesson per core drink (one
  sentence on what to take away from it, the live spec, then a drill on every facet), and a review
  that asks one rotating question per drink.
- **A lesson is finished when every question is answered correctly.** Wrong answers are marked and
  can be retried; the explanation appears with the right answer. Finishing is stored on the device
  as one row per lesson (Dexie v3, `lessonProgress`).
- **Courses are open**, in a recommended order. Today and Learn always point at the next unfinished
  lesson. Locking content adds friction without teaching anything.

## Consequences

- Correcting a spec in the Library corrects its lesson and its questions in the same change.
- `curriculum.test.ts` checks every course against its schema, that every drink and tool reference
  resolves, and that family courses only teach drinks from their family. `drill.test.ts` generates
  every drill in both unit systems and validates each question.
- Generated questions are plainer than hand-written ones. The authored introductions and tips carry
  the voice; drills carry the repetition.
- The age gate planned for M3 is deferred. It would add a stored item to the privacy policy and is
  not needed for the courses.
