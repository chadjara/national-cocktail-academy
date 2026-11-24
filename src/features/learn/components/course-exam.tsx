import { Lock, Trophy } from "lucide-react";
import { Link } from "react-router";

import { appConfig } from "~/config/app.config";
import type { Course } from "~/content/curriculum";
import { Badge, Button, Card, Heading, ICON_STROKE, Text } from "~/design-system";

import type { ExamStatus } from "../hooks/use-exams";
import { examUnlock } from "../services/exam";
import type { Progress } from "../services/progress";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** The exam's state on a course page: locked, ready, or passed. */
export function CourseExam({
  course,
  progress,
  status,
}: {
  course: Course;
  progress: Progress;
  status: ExamStatus | undefined;
}) {
  const { unlocked, remaining } = examUnlock(course, progress);
  const best = status?.best;
  const bestPercent = best ? Math.round((best.score / best.total) * 100) : undefined;

  return (
    <Card as="section" aria-labelledby="exam-heading" className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <Heading as="h2" size="md" id="exam-heading">
          Course exam
        </Heading>
        {status?.passed && (
          <Badge tone="brass" icon={<Trophy aria-hidden size={14} strokeWidth={ICON_STROKE} />}>
            Passed
          </Badge>
        )}
      </div>
      {!unlocked ? (
        <Text size="sm" tone="muted" className="flex items-center gap-0.5">
          <Lock aria-hidden size={16} strokeWidth={ICON_STROKE} />
          Finish {remaining.length} more {remaining.length === 1 ? "lesson" : "lessons"} to unlock
          the exam.
        </Text>
      ) : (
        <>
          <Text size="sm" tone="muted">
            {status?.passed && best
              ? `Best ${String(bestPercent)}% on ${dateFormat.format(new Date(best.submittedAt))}.`
              : best
                ? `Best so far ${String(bestPercent)}%. The pass mark is ${String(appConfig.assessment.passMarkPercent)}%.`
                : `Questions from across the course. The pass mark is ${String(appConfig.assessment.passMarkPercent)}%.`}
          </Text>
          <Button asChild variant={status?.passed ? "secondary" : "primary"} className="self-start">
            <Link to={`/learn/${course.id}/exam`}>
              {status?.passed ? "Retake for practice" : best ? "Retake the exam" : "Take the exam"}
            </Link>
          </Button>
        </>
      )}
    </Card>
  );
}
