import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router";

import { listCourses } from "~/content/curriculum";
import { Button, Card, Eyebrow, Heading, ICON_STROKE, Text } from "~/design-system";

import { FinalSteps } from "~/features/certificate/components/final-steps";

import { courseProgress, recommendNext, type Progress } from "../services/progress";
import { CourseIcon } from "./course-icon";

/** Where to pick up next: the next lesson, a course exam that's ready, then the Service Sim and certificate. */
export function ContinueCard({
  progress,
  passedExams,
}: {
  progress: Progress;
  passedExams: ReadonlySet<string>;
}) {
  const next = recommendNext(listCourses(), progress, passedExams);

  if (!next) return <FinalSteps />;

  if (next.kind === "exam") {
    return (
      <Card
        as="section"
        aria-labelledby="continue-heading"
        className="flex flex-col gap-2 border-accent"
      >
        <div className="flex items-start gap-2">
          <CourseIcon icon={next.course.icon} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <Eyebrow tone="accent">Exam ready</Eyebrow>
            <Heading as="h2" size="md" id="continue-heading">
              {next.course.title} exam
            </Heading>
            <Text size="sm" tone="muted">
              You've finished every lesson. Pass the exam to complete the course.
            </Text>
          </div>
        </div>
        <Button asChild className="self-start">
          <Link to={`/learn/${next.course.id}/exam`}>
            <Trophy aria-hidden size={18} strokeWidth={ICON_STROKE} />
            Take the exam
          </Link>
        </Button>
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
