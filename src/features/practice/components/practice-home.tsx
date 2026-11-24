import {
  ArrowRight,
  Calculator,
  Droplets,
  Layers,
  Timer,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";

import { listCourses } from "~/content/curriculum";
import { Button, Card, Eyebrow, Heading, ICON_STROKE, Skeleton, Text } from "~/design-system";
import { useProgress } from "~/features/learn/hooks/use-progress";
import { courseProgress } from "~/features/learn/services/progress";
import type { PracticeKind } from "~/lib/db/records";

import { useReviewSummary } from "../hooks/use-review";
import { useRuns, type RunStats } from "../hooks/use-runs";
import { formatDuration } from "../services/speed-round";

function ReviewCard() {
  const summary = useReviewSummary();
  if (summary.status === "loading") return <Skeleton className="h-22" />;
  if (summary.status === "error") return null;
  const { dueCount, newCount, drinks, reviewedToday } = summary.data;
  const waiting = dueCount + newCount;

  return (
    <Card
      as="section"
      aria-labelledby="review-heading"
      className="flex flex-col gap-2 border-accent"
    >
      <div className="flex items-start gap-2">
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-base border border-line bg-raised text-accent-text">
          <Layers aria-hidden size={24} strokeWidth={ICON_STROKE} />
        </span>
        <div className="flex flex-col gap-0.5">
          <Eyebrow tone="accent">Daily Review</Eyebrow>
          <Heading as="h2" size="md" id="review-heading">
            {drinks === 0
              ? "Learn a drink to start reviewing"
              : waiting === 0
                ? "You're up to date"
                : `${String(waiting)} ${waiting === 1 ? "card" : "cards"} to review`}
          </Heading>
          <Text size="sm" tone="muted">
            {drinks === 0
              ? "Every drink lesson you finish adds its spec, its glass and garnish, and its method as flashcards, timed to come back just before you'd forget them."
              : `${String(drinks)} ${drinks === 1 ? "drink" : "drinks"} in review${reviewedToday > 0 ? ` · ${String(reviewedToday)} reviewed today` : ""}${newCount > 0 ? ` · ${String(newCount)} new` : ""}.`}
          </Text>
        </div>
      </div>
      {drinks === 0 ? (
        <Button asChild variant="secondary" className="self-start">
          <Link to="/learn/sours">Start the Sours course</Link>
        </Button>
      ) : (
        waiting > 0 && (
          <Button asChild className="self-start">
            <Link to="/practice/review">
              Start review
              <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
            </Link>
          </Button>
        )
      )}
    </Card>
  );
}

function ToolCard({
  to,
  icon: Icon,
  title,
  body,
  kind,
  describe,
}: {
  to: string;
  icon: LucideIcon;
  title: string;
  body: string;
  kind: PracticeKind;
  describe: (stats: RunStats) => string | undefined;
}) {
  const stats = useRuns(kind);
  const detail =
    stats.status === "ready" && stats.data.count > 0 ? describe(stats.data) : undefined;
  return (
    <Card as="li" interactive className="flex h-full flex-col gap-1.5">
      <Icon aria-hidden size={24} strokeWidth={ICON_STROKE} className="text-accent-text" />
      <Heading as="h3" size="md">
        <Link to={to} className="after:absolute after:inset-0">
          {title}
        </Link>
      </Heading>
      <Text size="sm" tone="muted" className="flex-1">
        {body}
      </Text>
      {detail !== undefined && (
        <Text size="sm" className="flex items-center gap-0.5 text-ink">
          <Trophy aria-hidden size={16} strokeWidth={ICON_STROKE} className="text-brass" />
          {detail}
        </Text>
      )}
    </Card>
  );
}

function ProgressSummary() {
  const progress = useProgress();
  const review = useReviewSummary();
  if (progress.status !== "ready") return null;
  const courses = listCourses();
  const lessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const finishedCourses = courses.filter((course) => {
    const { done, total } = courseProgress(course, progress.data);
    return done === total;
  }).length;
  const stats = [
    {
      label: "Lessons finished",
      value: `${String(progress.data.completed.size)} of ${String(lessons)}`,
    },
    { label: "Courses complete", value: `${String(finishedCourses)} of ${String(courses.length)}` },
    {
      label: "Drinks in review",
      value: review.status === "ready" ? String(review.data.drinks) : "–",
    },
  ];
  return (
    <section aria-labelledby="progress-heading" className="flex flex-col gap-1.5">
      <Heading as="h2" size="lg" id="progress-heading">
        Your progress
      </Heading>
      <dl className="grid grid-cols-3 gap-1.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-0.5 rounded-base border border-line p-1.5"
          >
            <dt className="text-caption text-ink-subtle">{stat.label}</dt>
            <dd className="text-heading-md font-semibold text-ink tabular">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function PracticeHome() {
  return (
    <div className="flex flex-col gap-4">
      <ReviewCard />
      <section aria-labelledby="drills-heading" className="flex flex-col gap-1.5">
        <Heading as="h2" size="lg" id="drills-heading">
          Drills
        </Heading>
        <ul aria-labelledby="drills-heading" className="grid gap-1.5 sm:grid-cols-3">
          <ToolCard
            to="/practice/speed-round"
            icon={Timer}
            title="Speed Round"
            body="Five tickets against the clock. Build each drink from memory: ingredients, glass, ice, method, garnish."
            kind="speed-round"
            describe={(stats) =>
              stats.best &&
              `Best ${String(stats.best.score)}/${String(stats.best.total)} in ${formatDuration(stats.best.durationMs)}`
            }
          />
          <ToolCard
            to="/practice/pour"
            icon={Droplets}
            title="Pour Trainer"
            body="Learn a steady free-pour count, then check it with water and a jigger at home."
            kind="pour-timing"
            describe={(stats) =>
              stats.best && `Best round ${String(stats.best.score)}/${String(stats.best.total)}`
            }
          />
          <ToolCard
            to="/practice/math"
            icon={Calculator}
            title="Bar Math"
            body="Pour cost, menu pricing, batching, dilution and par levels, with worked solutions."
            kind="bar-math"
            describe={(stats) =>
              stats.best && `Best set ${String(stats.best.score)}/${String(stats.best.total)}`
            }
          />
        </ul>
      </section>
      <ProgressSummary />
    </div>
  );
}
