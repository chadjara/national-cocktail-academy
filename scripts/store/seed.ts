/**
 * Sample progress for the App Store screenshots: a student partway through
 * the program, and a graduate. Built from the real content and the app's own
 * exam dealer and scheduler, then restored through the app's backup screen, so
 * every row passes the same validation a real backup does.
 *
 * Loaded by scripts/store/screenshots.mjs through Vite (for the `~` alias).
 */
import { getIngredient, listBottles, listCocktails } from "~/content";
import { listCourses, type Course } from "~/content/curriculum";
import { BACKUP_FORMAT, BACKUP_VERSION, type Backup } from "~/lib/db/backup";
import { buildExam } from "~/features/learn/services/exam";
import { newSchedulerState, schedule } from "~/features/practice/services/scheduler";
import {
  POINTS_PER_MOMENT,
  SHIFT_MOMENTS,
  SHIFT_TICKETS,
} from "~/features/practice/services/service-sim";
import { POINTS_PER_TICKET } from "~/features/practice/services/speed-round";

type Tables = Backup["tables"];

const DAY = 24 * 60 * 60 * 1000;

function course(id: string): Course {
  const found = listCourses().find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Unknown course ${id}`);
  return found;
}

function lessonsDone(courseId: string, count: number, at: (index: number) => Date) {
  return course(courseId)
    .lessons.slice(0, count)
    .map((lesson, index) => ({
      id: `${courseId}/${lesson.id}`,
      courseId,
      lessonId: lesson.id,
      completedAt: at(index).toISOString(),
    }));
}

function passedExam(courseId: string, submittedAt: Date, missed: number) {
  const seed = `store-${courseId}`;
  const questions = buildExam(course(courseId), "oz", seed);
  const topics = new Map<string, { lessonId: string; right: number; total: number }>();
  questions.forEach((question, index) => {
    const topic = topics.get(question.lessonId) ?? {
      lessonId: question.lessonId,
      right: 0,
      total: 0,
    };
    topics.set(question.lessonId, {
      ...topic,
      right: topic.right + (index < missed ? 0 : 1),
      total: topic.total + 1,
    });
  });
  return {
    courseId,
    seed,
    questionIds: questions.map((question) => question.id),
    score: questions.length - missed,
    total: questions.length,
    passed: true,
    topics: [...topics.values()],
    startedAt: new Date(submittedAt.getTime() - 6 * 60 * 1000).toISOString(),
    submittedAt: submittedAt.toISOString(),
  };
}

/** Review cards for drinks learned a few days ago: most are due today. */
function reviewCards(cocktailIds: readonly string[], now: Date) {
  return cocktailIds.flatMap((cocktailId, index) =>
    (["spec", "method"] as const).map((facet, facetIndex) => {
      const learned = new Date(now.getTime() - (4 + index) * DAY);
      const state = schedule(newSchedulerState(learned), "good", learned, { fuzz: false });
      // The first few come due today; the rest later this week.
      const due =
        index * 2 + facetIndex < 6
          ? new Date(now.getTime() - (index + 1) * 60 * 60 * 1000)
          : new Date(now.getTime() + (index + 1) * DAY);
      return {
        id: `${cocktailId}:${facet}`,
        cocktailId,
        facet,
        due: due.toISOString(),
        addedAt: learned.toISOString(),
        scheduler: { ...state, due: due.toISOString() },
      };
    }),
  );
}

function bottles(now: Date) {
  const wanted = [
    "gin",
    "vodka",
    "white-rum",
    "aged-rum",
    "bourbon",
    "rye",
    "tequila-blanco",
    "mezcal",
    "triple-sec",
    "maraschino",
    "green-chartreuse",
    "campari",
    "aperol",
    "sweet-vermouth",
    "dry-vermouth",
    "prosecco",
    "angostura",
    "orange-bitters",
  ];
  const available = new Set(listBottles().map((bottle) => bottle.id));
  return wanted
    .filter((id) => available.has(id))
    .map((ingredientId) => ({
      ingredientId,
      addedAt: new Date(now.getTime() - 9 * DAY).toISOString(),
    }));
}

function backup(tables: Partial<Tables>, now: Date): Backup {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    appVersion: __APP_VERSION__,
    tables: {
      meta: [{ key: "units", value: "oz" }],
      favorites: [],
      barItems: [],
      lessonProgress: [],
      reviewCards: [],
      reviewLogs: [],
      practiceRuns: [],
      examAttempts: [],
      capstoneAttempts: [],
      certificate: [],
      ...tables,
    },
  };
}

const favorites = (now: Date) =>
  ["negroni", "last-word", "daiquiri", "paper-plane", "mai-tai"].map((cocktailId, index) => ({
    cocktailId,
    addedAt: new Date(now.getTime() - (index + 1) * DAY).toISOString(),
  }));

const daysAgo = (now: Date, days: number) => new Date(now.getTime() - days * DAY);

/**
 * Two weeks in: the foundations done (three exams passed, Garnishes' exam
 * waiting), halfway through Sours, cards due and a Speed Round best.
 */
export function studentBackup(now: Date = new Date()): Backup {
  return backup(
    {
      favorites: favorites(now),
      barItems: bottles(now),
      lessonProgress: [
        ...lessonsDone("bar-tools", 7, (i) => daysAgo(now, 14 - i * 0.1)),
        ...lessonsDone("glassware-and-ice", 6, (i) => daysAgo(now, 12 - i * 0.1)),
        ...lessonsDone("technique", 8, (i) => daysAgo(now, 10 - i * 0.1)),
        ...lessonsDone("garnishes", 7, (i) => daysAgo(now, 7 - i * 0.1)),
        ...lessonsDone("sours", 5, (i) => daysAgo(now, 4 - i * 0.5)),
      ],
      examAttempts: [
        passedExam("bar-tools", daysAgo(now, 13), 1),
        passedExam("glassware-and-ice", daysAgo(now, 11), 0),
        passedExam("technique", daysAgo(now, 9), 2),
      ],
      reviewCards: reviewCards(["daiquiri", "margarita", "whiskey-sour", "sidecar"], now),
      practiceRuns: [
        {
          kind: "speed-round",
          score: 8,
          total: 10,
          durationMs: 95_000,
          finishedAt: daysAgo(now, 2).toISOString(),
        },
        {
          kind: "bar-math",
          score: 9,
          total: 10,
          durationMs: 120_000,
          finishedAt: daysAgo(now, 1).toISOString(),
        },
      ],
    },
    now,
  );
}

/** Every course and exam passed, the Service Sim passed, and the certificate issued. */
export function graduateBackup(now: Date = new Date()): Backup {
  const courses = listCourses();
  const shiftTotal = SHIFT_TICKETS * POINTS_PER_TICKET + SHIFT_MOMENTS * POINTS_PER_MOMENT;
  return backup(
    {
      favorites: favorites(now),
      barItems: bottles(now),
      lessonProgress: courses.flatMap((c, ci) =>
        lessonsDone(c.id, c.lessons.length, (i) => daysAgo(now, 40 - ci * 2.5 - i * 0.1)),
      ),
      examAttempts: courses.map((c, ci) => passedExam(c.id, daysAgo(now, 38 - ci * 2.5), ci % 3)),
      capstoneAttempts: [
        {
          score: shiftTotal - 4,
          total: shiftTotal,
          unsafe: false,
          passed: true,
          durationMs: 14 * 60_000,
          finishedAt: daysAgo(now, 1).toISOString(),
        },
      ],
      certificate: [
        {
          key: "current",
          displayName: "Alex Rivera",
          certificateId: "NCA-7K4P-2QXM",
          issuedAt: daysAgo(now, 1).toISOString(),
          appVersion: __APP_VERSION__,
        },
      ],
    },
    now,
  );
}

/**
 * The right option for an authored question, found by its set of options (the
 * player shuffles them). Undefined for generated questions.
 */
export function authoredAnswer(options: readonly string[]): string | undefined {
  const wanted = [...options].sort().join("\n");
  for (const c of listCourses())
    for (const lesson of c.lessons)
      for (const block of lesson.blocks)
        if (block.kind === "question" && [...block.question.options].sort().join("\n") === wanted)
          return block.question.options[block.question.answer];
  return undefined;
}

/** The ingredient names in a drink's spec, for tapping the right chips on a ticket. */
export function specIngredientNames(drinkName: string): string[] {
  const cocktail = listCocktails().find((candidate) => candidate.name === drinkName);
  return cocktail ? cocktail.spec.map((line) => getIngredient(line.ingredient).name) : [];
}
