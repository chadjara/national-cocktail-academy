import { ArrowLeft, CircleCheck, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Button, EmptyState, ICON_STROKE, ProgressBar, Skeleton, Text } from "~/design-system";
import { useUnits } from "~/features/library/hooks/use-units";
import type { ReviewCardRecord } from "~/lib/db/records";
import { tapFeedback } from "~/lib/native";

import { reviewRepository } from "../repositories/review-repository";
import { buildQueue, startOfDay } from "../services/cards";
import { formatInterval, previewDue, REVIEW_GRADES, type ReviewGrade } from "../services/scheduler";
import { ReviewCard } from "./review-card";

/** Cards due again within this window come back in the same session. */
const RELEARN_WINDOW_MS = 20 * 60_000;

/** True when a card is due again soon enough to come back in this session. */
function dueSoon(card: ReviewCardRecord): boolean {
  return new Date(card.due).getTime() - Date.now() < RELEARN_WINDOW_MS;
}

/** The grade buttons' labels: how long until the card comes back for each grade. */
function intervalLabels(card: ReviewCardRecord): Record<ReviewGrade, string> {
  const now = new Date();
  const due = previewDue(card.scheduler, now);
  return {
    again: formatInterval(now, due.again),
    hard: formatInterval(now, due.hard),
    good: formatInterval(now, due.good),
    easy: formatInterval(now, due.easy),
  };
}

const gradeLabels: Record<ReviewGrade, { label: string; hint: string }> = {
  again: { label: "Again", hint: "Didn't know it" },
  hard: { label: "Hard", hint: "Got it, with effort" },
  good: { label: "Good", hint: "Got it" },
  easy: { label: "Easy", hint: "Knew it cold" },
};

function Session({ initial }: { initial: ReviewCardRecord[] }) {
  const { units } = useUnits();
  const [queue, setQueue] = useState(initial);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [busy, setBusy] = useState(false);
  const current = queue[0];

  if (!current) {
    return (
      <EmptyState
        headingLevel="h2"
        icon={<CircleCheck aria-hidden size={24} strokeWidth={ICON_STROKE} />}
        title="Review done for today"
        description={`You reviewed ${String(done)} ${done === 1 ? "card" : "cards"}. Come back tomorrow; the scheduler brings each one back just before you'd forget it.`}
        action={
          <Button asChild>
            <Link to="/practice">Back to Practice</Link>
          </Button>
        }
      />
    );
  }

  const intervals = intervalLabels(current);

  async function grade(value: ReviewGrade) {
    if (!current || busy) return;
    setBusy(true);
    tapFeedback();
    const updated = await reviewRepository.grade(current.id, value);
    const rest = queue.slice(1);
    const again = updated !== undefined && dueSoon(updated);
    setQueue(again ? [...rest, updated] : rest);
    setDone((count) => count + 1);
    setRevealed(false);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <ProgressBar
        label={`${String(done)} reviewed · ${String(queue.length)} to go`}
        value={done}
        max={done + queue.length}
      />
      <ReviewCard
        key={`${current.id}-${String(done)}`}
        cocktailId={current.cocktailId}
        facet={current.facet}
        revealed={revealed}
        units={units}
      />
      {revealed ? (
        <div className="flex flex-col gap-1">
          <Text size="sm" tone="muted" id="grade-help">
            How well did you know it?
          </Text>
          <div
            role="group"
            aria-describedby="grade-help"
            className="grid grid-cols-2 gap-1 sm:grid-cols-4"
          >
            {REVIEW_GRADES.map((value) => (
              <Button
                key={value}
                variant={value === "good" ? "primary" : "secondary"}
                disabled={busy}
                onClick={() => void grade(value)}
                className="h-auto flex-col gap-0 py-1"
              >
                <span>{gradeLabels[value].label}</span>
                <span className="text-caption font-normal opacity-80">
                  {gradeLabels[value].hint} · {intervals[value]}
                </span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <Button size="lg" onClick={() => setRevealed(true)}>
          Show answer
        </Button>
      )}
    </div>
  );
}

type Snapshot = { cards: ReviewCardRecord[]; drinks: number };

/** Loads today's queue once: grading mid-session must not reshuffle the cards under the student. */
async function loadSnapshot(): Promise<Snapshot> {
  await reviewRepository.syncFromLessons();
  const now = new Date();
  const [cards, today] = await Promise.all([
    reviewRepository.list(),
    reviewRepository.reviewedSince(startOfDay(now)),
  ]);
  return {
    cards: buildQueue(cards, now, today.newCards).cards,
    drinks: new Set(cards.map((card) => card.cocktailId)).size,
  };
}

/** Daily Review: today's queue, snapshotted when the session starts. */
export function ReviewSession() {
  const [snapshot, setSnapshot] = useState<Snapshot | "error" | null>(null);

  useEffect(() => {
    let active = true;
    loadSnapshot().then(
      (loaded) => active && setSnapshot(loaded),
      () => active && setSnapshot("error"),
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <Button variant="ghost" asChild>
        <Link to="/practice" className="-ml-1 self-start">
          <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
          Practice
        </Link>
      </Button>
      {snapshot === null ? (
        <Skeleton className="h-30" />
      ) : snapshot === "error" ? (
        <Text tone="muted">
          Your review cards couldn't be loaded. Close and reopen the app to try again.
        </Text>
      ) : snapshot.drinks === 0 ? (
        <EmptyState
          headingLevel="h2"
          icon={<Layers aria-hidden size={24} strokeWidth={ICON_STROKE} />}
          title="Nothing to review yet"
          description="Finish a drink lesson in any drink-family course, or add a spec from the Library, and its cards will appear here."
          action={
            <Button asChild>
              <Link to="/learn/sours">Start the Sours course</Link>
            </Button>
          }
        />
      ) : (
        <Session initial={snapshot.cards} />
      )}
    </div>
  );
}
