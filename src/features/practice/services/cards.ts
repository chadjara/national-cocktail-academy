import { listCourses } from "~/content/curriculum";
import { withArticle } from "~/features/learn/services/wording";
import type { ReviewCardRecord, ReviewFacet } from "~/lib/db/records";

import { NEW_STATE } from "./scheduler";

export const REVIEW_FACETS: readonly ReviewFacet[] = ["spec", "service", "method"];

/** New cards introduced per day, so a student who finishes a course in one sitting isn't buried. */
export const NEW_CARDS_PER_DAY = 15;

export function reviewCardId(cocktailId: string, facet: ReviewFacet): string {
  return `${cocktailId}:${facet}`;
}

export const facetLabels: Record<ReviewFacet, { label: string; prompt: (name: string) => string }> =
  {
    spec: { label: "Spec", prompt: (name) => `What's the spec for ${withArticle(name)}?` },
    service: {
      label: "Glass, ice & garnish",
      prompt: (name) => `What glass, ice and garnish does ${withArticle(name)} get?`,
    },
    method: { label: "Method", prompt: (name) => `How do you make ${withArticle(name)}?` },
  };

/**
 * Drinks the student has learned in a course: every drink whose lesson they
 * finished. These are enrolled in Daily Review automatically.
 */
export function learnedCocktailIds(completed: ReadonlySet<string>): string[] {
  const ids = new Set<string>();
  for (const course of listCourses()) {
    for (const lesson of course.lessons) {
      if (!completed.has(`${course.id}/${lesson.id}`)) continue;
      for (const block of lesson.blocks) if (block.kind === "cocktail") ids.add(block.cocktailId);
    }
  }
  return [...ids];
}

export type ReviewQueue = {
  /** Cards to show this session, in order: due reviews first, then today's new cards. */
  cards: ReviewCardRecord[];
  dueCount: number;
  newCount: number;
};

/** Builds today's queue from every card and how many new cards were already started today. */
export function buildQueue(
  cards: readonly ReviewCardRecord[],
  now: Date,
  newStartedToday: number,
  newPerDay: number = NEW_CARDS_PER_DAY,
): ReviewQueue {
  const due = cards
    .filter((card) => card.scheduler.state !== NEW_STATE && new Date(card.due) <= now)
    .sort((a, b) => a.due.localeCompare(b.due));
  const fresh = cards
    .filter((card) => card.scheduler.state === NEW_STATE)
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt) || a.id.localeCompare(b.id))
    .slice(0, Math.max(0, newPerDay - newStartedToday));
  return { cards: [...due, ...fresh], dueCount: due.length, newCount: fresh.length };
}

/** The start of the student's day, in their own time zone. */
export function startOfDay(now: Date): Date {
  const day = new Date(now);
  day.setHours(0, 0, 0, 0);
  return day;
}
