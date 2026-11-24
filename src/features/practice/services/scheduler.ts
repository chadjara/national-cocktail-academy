import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  State,
  type Card,
  type Grade,
} from "ts-fsrs";

import type { SchedulerState } from "~/lib/db/records";

/**
 * The only module that knows about ts-fsrs (ADR 0005). Everything else works
 * with plain, JSON-safe `SchedulerState` records and these four grades, so the
 * algorithm can be re-tuned or replaced without touching the UI or storage.
 */

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export const REVIEW_GRADES: readonly ReviewGrade[] = ["again", "hard", "good", "easy"];

const toRating: Record<ReviewGrade, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

/** Fuzz spreads reviews apart in production; tests turn it off for exact dates. */
function scheduler(fuzz: boolean) {
  return fsrs(generatorParameters({ enable_fuzz: fuzz, maximum_interval: 365 }));
}

const live = scheduler(true);

const STATES: readonly State[] = [State.New, State.Learning, State.Review, State.Relearning];

function toCard(state: SchedulerState): Card {
  return {
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    // Deprecated in ts-fsrs 5 and ignored by its scheduling, but still part of its Card type.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    elapsed_days: state.elapsedDays,
    scheduled_days: state.scheduledDays,
    learning_steps: state.learningSteps,
    reps: state.reps,
    lapses: state.lapses,
    state: STATES[state.state] ?? State.New,
    ...(state.lastReview !== undefined ? { last_review: new Date(state.lastReview) } : {}),
  };
}

function fromCard(card: Card): SchedulerState {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    ...(card.last_review ? { lastReview: card.last_review.toISOString() } : {}),
  };
}

/** A card the student hasn't seen yet, due now. */
export function newSchedulerState(now: Date): SchedulerState {
  return fromCard(createEmptyCard(now));
}

/** Applies a grade and returns the card's next state. */
export function schedule(
  state: SchedulerState,
  grade: ReviewGrade,
  now: Date,
  { fuzz = true }: { fuzz?: boolean } = {},
): SchedulerState {
  const engine = fuzz ? live : scheduler(false);
  return fromCard(engine.next(toCard(state), now, toRating[grade]).card);
}

/** When the card would next be due for each grade, for the labels on the grade buttons. */
export function previewDue(state: SchedulerState, now: Date): Record<ReviewGrade, Date> {
  const preview = scheduler(false).repeat(toCard(state), now);
  return {
    again: preview[Rating.Again].card.due,
    hard: preview[Rating.Hard].card.due,
    good: preview[Rating.Good].card.due,
    easy: preview[Rating.Easy].card.due,
  };
}

/** "10 min", "3 h", "4 days", "2 mo": how far away a due date is, for a button label. */
export function formatInterval(from: Date, to: Date): string {
  const minutes = Math.max(1, Math.round((to.getTime() - from.getTime()) / 60_000));
  if (minutes < 60) return `${String(minutes)} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${String(hours)} h`;
  const days = Math.round(hours / 24);
  if (days < 31) return days === 1 ? "1 day" : `${String(days)} days`;
  const months = Math.round(days / 30);
  if (months < 12) return `${String(months)} mo`;
  return "1 yr";
}

export const NEW_STATE = 0;
