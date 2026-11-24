import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import type { Course } from "~/content/curriculum";
import {
  Button,
  Dialog,
  Display,
  Eyebrow,
  Heading,
  ICON_STROKE,
  ProgressBar,
  Text,
  cn,
  useToast,
} from "~/design-system";

import { useLessonActions, useProgress } from "../hooks/use-progress";
import {
  courseProgress,
  emptyProgress,
  isLessonComplete,
  nextLessonIn,
} from "../services/progress";
import { CourseIcon } from "./course-icon";

/** A course's syllabus: every lesson in order, with what's done and what's next. */
export function CourseView({ course }: { course: Course }) {
  const state = useProgress();
  const ready = state.status === "ready";
  const progress = ready ? state.data : emptyProgress;
  const { done, total } = courseProgress(course, progress);
  const next = nextLessonIn(course, progress);
  const { resetCourse } = useLessonActions();
  const { show } = useToast();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" asChild>
        <Link to="/learn" className="-ml-1 self-start">
          <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
          All courses
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <CourseIcon icon={course.icon} size={32} />
        <Eyebrow tone="accent">
          {course.group === "foundations" ? "Foundations" : "Drink family"}
        </Eyebrow>
        <Display size="lg">{course.title}</Display>
        <Text size="lg" tone="muted" className="max-w-80">
          {course.summary}
        </Text>
        {ready && (
          <div className="flex max-w-80 flex-col gap-2 pt-1">
            <ProgressBar
              label={`${String(done)} of ${String(total)} lessons complete`}
              value={done}
              max={total}
              tone={done === total ? "success" : "accent"}
            />
            {next && (
              <Button asChild className="self-start">
                <Link to={`/learn/${course.id}/${next.id}`}>
                  {done === 0 ? "Start the course" : `Continue: ${next.title}`}
                  <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
                </Link>
              </Button>
            )}
          </div>
        )}
      </header>

      <section aria-labelledby="lessons-heading" className="flex flex-col gap-1.5">
        <Heading as="h2" size="lg" id="lessons-heading">
          Lessons
        </Heading>
        <ol
          aria-labelledby="lessons-heading"
          className="flex flex-col divide-y divide-line border-y border-line"
        >
          {course.lessons.map((lesson, index) => {
            const complete = ready && isLessonComplete(progress, course.id, lesson.id);
            const isNext = ready && next?.id === lesson.id;
            return (
              <li key={lesson.id}>
                <Link
                  to={`/learn/${course.id}/${lesson.id}`}
                  className="group flex min-h-8 items-center gap-2 px-0.5 py-1.5 transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-surface"
                >
                  <span
                    className={cn(
                      "inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular",
                      complete && "border-success bg-success text-canvas",
                      !complete && isNext && "border-accent text-accent-text",
                      !complete && !isNext && "border-line-strong text-ink-muted",
                    )}
                  >
                    {complete ? <Check aria-hidden size={16} strokeWidth={2.25} /> : index + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display-optical text-heading-md text-ink">
                      {lesson.title}
                    </span>
                    <span className="text-sm text-ink-subtle">{lesson.summary}</span>
                  </span>
                  <span className="sr-only">
                    {complete ? "(complete)" : isNext ? "(up next)" : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {ready && done > 0 && (
        <div>
          <Button
            variant="ghost"
            onClick={() => setConfirming(true)}
            leadingIcon={<RotateCcw aria-hidden size={18} strokeWidth={ICON_STROKE} />}
          >
            Reset progress for this course
          </Button>
        </div>
      )}

      <Dialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Reset ${course.title}?`}
        description="Every lesson in this course will be marked as not done. Other courses aren't affected."
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Keep progress
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetCourse(course.id);
                setConfirming(false);
                show({ title: `${course.title} progress reset` });
              }}
            >
              Reset course
            </Button>
          </>
        }
      >
        {null}
      </Dialog>
    </div>
  );
}
