import { ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "react-router";

import { listCourses } from "~/content/curriculum";
import { Button, Card, Eyebrow, Heading, ICON_STROKE, Text } from "~/design-system";

import { courseProgress, recommendNext, type Progress } from "../services/progress";
import { CourseIcon } from "./course-icon";

/** Where to pick up next: the first unfinished lesson, or a well-done once it's all finished. */
export function ContinueCard({ progress }: { progress: Progress }) {
  const next = recommendNext(listCourses(), progress);

  if (!next) {
    return (
      <Card className="flex items-start gap-2 border-success bg-success-subtle">
        <GraduationCap
          aria-hidden
          size={28}
          strokeWidth={ICON_STROKE}
          className="shrink-0 text-success"
        />
        <div className="flex flex-col gap-0.5">
          <Heading as="h2" size="md">
            You've finished every course
          </Heading>
          <Text tone="muted">
            Keep your specs sharp: revisit any review lesson, or test yourself on the Library cards.
          </Text>
        </div>
      </Card>
    );
  }

  const { course, lesson, started } = next;
  const { done, total } = courseProgress(course, progress);
  return (
    <Card
      as="section"
      aria-labelledby="continue-heading"
      className="flex flex-col gap-2 border-accent"
    >
      <div className="flex items-start gap-2">
        <CourseIcon icon={course.icon} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <Eyebrow tone="accent">{started ? "Continue learning" : "Start here"}</Eyebrow>
          <Heading as="h2" size="md" id="continue-heading">
            {lesson.title}
          </Heading>
          <Text size="sm" tone="muted">
            {course.title} · lesson {done + 1} of {total}
          </Text>
        </div>
      </div>
      <Button asChild className="self-start">
        <Link to={`/learn/${course.id}/${lesson.id}`}>
          {started ? "Continue" : "Start the first lesson"}
          <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
        </Link>
      </Button>
    </Card>
  );
}
