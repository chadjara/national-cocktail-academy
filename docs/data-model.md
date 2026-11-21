# Data model

There are two layers. **Content** is static, versioned, bundled at build time and validated with
Zod in CI. **User state** lives in Dexie/IndexedDB with versioned schema migrations. User records
reference content by **stable slug IDs**. A `contentMigrations` map handles renamed or removed
content.

```mermaid
erDiagram
  PROGRAM ||--|{ COURSE : contains
  COURSE ||--|{ MODULE : contains
  MODULE ||--|{ LESSON : contains
  COURSE ||--o| EXAM_BLUEPRINT : "ends with"
  EXAM_BLUEPRINT }o--|{ QUESTION : "draws from (by tag)"
  LESSON }o--o{ TECHNIQUE : teaches
  LESSON }o--o{ COCKTAIL : features
  COCKTAIL ||--|{ SPEC_LINE : has
  SPEC_LINE }o--|| INGREDIENT : uses
  INGREDIENT }o--o| SPIRIT_CATEGORY : "is a"
  COCKTAIL }o--|| FAMILY : "belongs to"
  COCKTAIL }o--|| GLASSWARE : "served in"
  COCKTAIL }o--|| ICE : "served on"
  COCKTAIL }o--|{ TECHNIQUE : "made with"
  COCKTAIL }o--o{ COCKTAIL : "variation of"
  RS_SCENARIO ||--|{ SCENARIO_NODE : "branches into"

  PROFILE ||--o{ LESSON_PROGRESS : tracks
  PROFILE ||--o{ REVIEW_CARD : owns
  REVIEW_CARD ||--o{ REVIEW_LOG : logs
  PROFILE ||--o{ DRILL_SESSION : runs
  DRILL_SESSION ||--|{ DRILL_ATTEMPT : contains
  PROFILE ||--o{ EXAM_ATTEMPT : takes
  PROFILE ||--o{ SCENARIO_RUN : plays
  PROFILE ||--o| CERTIFICATE : earns
  PROFILE ||--o{ BAR_ITEM : stocks
  PROFILE ||--o{ FAVORITE : saves
```

**Content entities:**

- **Cocktail:** `id, name, familyId, difficulty(1–3), glassId, iceId, method(shake|stir|build|throw|swizzle|blend), garnish, specLines[{ingredientId, amountMl|unit, note}], buildOrder[], techniqueIds[], history, variationOfId?, tags`
- **Lesson:** `id, moduleId, order, type(reading|technique|drill|quiz), title, estMinutes, body(MDX), blocks[], cocktailIds[], techniqueIds[], completionRule`
- **Question:** `id, type(single|multi|order|numeric|spec-build), prompt, options, answer, explanation, tags[courseId, topic], difficulty`
- **ExamBlueprint:** `courseId, sections[{tag, count}], passMark, timeLimitSec, cooldownHours`
- **RsScenario:** a node graph of guest dialogue. Each choice node carries feedback and a
  correct, acceptable or unsafe weight.

**User entities (Dexie):**

- **Profile:** `displayName, units, ageGateAck{mode, at}, theme, installedPromptSeen, createdAt`
- **LessonProgress:** `lessonId, status, blockState, startedAt, completedAt`
- **ReviewCard:** `cardId(cocktailId:facet), fsrs{due, stability, difficulty, reps, lapses, state}`
- **ReviewLog:** `cardId, rating, reviewedAt, elapsedMs`
- **DrillSession / DrillAttempt:** `kind(speed|pour|math|build), score, durationMs, items[{target, response, correct, ms}]`
- **ExamAttempt:** `examId, seed, questionIds snapshot, answers, score, topicBreakdown, passed, startedAt, submittedAt`
- **ScenarioRun:** `scenarioId, path[], outcome`
- **Certificate:** `id (ULID), programId, displayName, issuedAt, contentVersion`
- **BarItem:** `ingredientId`
- **Favorite:** `cocktailId`
- **Meta:** `schemaVersion, lastBackupAt`

---

## Implementation status

The ERD above is the approved target. Tables land in the milestone that first uses them, each as a
new Dexie `version()` block, so every release runs a real migration.

| Schema version | Milestone | Tables added | Notes                                             |
| -------------- | --------- | ------------ | ------------------------------------------------- |
| 1              | M0        | `meta`       | Device-level settings (`installHintDismissedAt`). |

Theme preference is deliberately **not** in IndexedDB: it lives in `localStorage` under
`academy.theme` so it can be applied before first paint (ADR 0003).
