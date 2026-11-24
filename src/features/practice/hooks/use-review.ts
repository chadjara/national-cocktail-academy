import { useCallback, useEffect } from "react";

import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";
import { tapFeedback } from "~/lib/native";

import { reviewRepository } from "../repositories/review-repository";
import { buildQueue, startOfDay, type ReviewQueue } from "../services/cards";

export type ReviewSummary = ReviewQueue & {
  /** Drinks enrolled in Daily Review. */
  drinks: number;
  reviewedToday: number;
};

/**
 * Today's review queue, live. Drinks from finished lessons are enrolled first,
 * so a student who just finished the Daiquiri lesson finds it waiting here.
 */
export function useReviewSummary(): LiveQueryState<ReviewSummary> {
  useEffect(() => {
    void reviewRepository.syncFromLessons();
  }, []);

  return useLiveQuery(async (): Promise<ReviewSummary> => {
    const now = new Date();
    const [cards, today] = await Promise.all([
      reviewRepository.list(),
      reviewRepository.reviewedSince(startOfDay(now)),
    ]);
    return {
      ...buildQueue(cards, now, today.newCards),
      drinks: new Set(cards.map((card) => card.cocktailId)).size,
      reviewedToday: today.reviews,
    };
  }, []);
}

/** Whether one drink is in Daily Review, with a toggle for the Library. */
export function useReviewEnrollment(cocktailId: string): {
  enrolled: LiveQueryState<boolean>;
  setEnrolled: (enrolled: boolean) => void;
} {
  const enrolled = useLiveQuery(
    async () => (await reviewRepository.enrolledCocktailIds()).has(cocktailId),
    [cocktailId],
  );
  const setEnrolled = useCallback(
    (value: boolean) => {
      tapFeedback();
      void (value ? reviewRepository.enroll([cocktailId]) : reviewRepository.unenroll(cocktailId));
    },
    [cocktailId],
  );
  return { enrolled, setEnrolled };
}
