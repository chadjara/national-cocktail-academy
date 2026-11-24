import { ArrowRight, Layers } from "lucide-react";
import { Link } from "react-router";

import { Card, Heading, ICON_STROKE, Text } from "~/design-system";

import { useReviewSummary } from "../hooks/use-review";

/** On Today, only when there's something to review. */
export function TodayReview() {
  const summary = useReviewSummary();
  if (summary.status !== "ready") return null;
  const waiting = summary.data.dueCount + summary.data.newCount;
  if (waiting === 0) return null;
  return (
    <Card interactive className="flex items-center gap-2">
      <Layers
        aria-hidden
        size={24}
        strokeWidth={ICON_STROKE}
        className="shrink-0 text-accent-text"
      />
      <div className="flex flex-1 flex-col">
        <Heading as="h2" size="sm">
          <Link to="/practice/review" className="after:absolute after:inset-0">
            {waiting} {waiting === 1 ? "card" : "cards"} to review
          </Link>
        </Heading>
        <Text size="sm" tone="muted">
          Daily Review · a few minutes
        </Text>
      </div>
      <ArrowRight aria-hidden size={20} strokeWidth={ICON_STROKE} className="text-ink-subtle" />
    </Card>
  );
}
