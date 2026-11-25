import { CircleCheck, Trophy } from "lucide-react";
import { Link } from "react-router";

import {
  courseGroupLabels,
  listCourses,
  type Course,
  type CourseGroup,
} from "~/content/curriculum";
import { Badge, Card, Heading, ICON_STROKE, ProgressBar, Text } from "~/design-system";

import { useExamStatuses } from "../hooks/use-exams";
import { useProgress } from "../hooks/use-progress";
import { passedExamIds } from "../services/exam-status";
import { courseProgress, emptyProgress, type Progress } from "../services/progress";
import { ContinueCard } from "./continue-card";
import { CourseIcon } from "./course-icon";

function CourseCard({
  course,
  progress,
  ready,
  examPassed,
}: {
  course: Course;
  progress: Progress;
  ready: boolean;
  examPassed: boolean;
}) {
  const { done, total } = courseProgress(course, progress);
  const complete = done === total;
  return (
    <Card as="li" interactive className="flex h-full flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <CourseIcon icon={course.icon} />
        {ready && examPassed ? (
          <Badge tone="brass" icon={<Trophy aria-hidden size={14} strokeWidth={ICON_STROKE} />}>
            Exam passed
          </Badge>
        ) : (
          ready &&
          complete && (
            <Badge
              tone="accent"
              icon={<CircleCheck aria-hidden size={14} strokeWidth={ICON_STROKE} />}
            >
              Exam ready
            </Badge>
          )
        )}
      </div>
      <Heading as="h3" size="md">
        <Link to={`/learn/${course.id}`} className="after:absolute after:inset-0">
          {course.title}
        </Link>
      </Heading>
      <Text size="sm" tone="muted" className="flex-1">
        {course.summary}
      </Text>
      {ready && done > 0 && !complete ? (
        <ProgressBar
          label={`${String(done)} of ${String(total)} lessons`}
          value={done}
          max={total}
        />
      ) : (
        <Text size="sm" tone="subtle">
          {total} lessons
        </Text>
      )}
    </Card>
  );
}

/** The academy's full curriculum, grouped, with progress from the device. */
export function CourseList() {
  const state = useProgress();
  const ready = state.status === "ready";
  const progress = ready ? state.data : emptyProgress;
  const exams = useExamStatuses();
  const passed = passedExamIds(exams);
  const groups: CourseGroup[] = ["foundations", "families"];

  return (
    <div className="flex flex-col gap-5">
      {ready && exams.status !== "loading" && (
        <ContinueCard progress={progress} passedExams={passed} />
      )}
      {groups.map((group) => {
        const courses = listCourses().filter((course) => course.group === group);
        const headingId = `group-${group}`;
        return (
          <section key={group} aria-labelledby={headingId} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <Heading as="h2" size="lg" id={headingId}>
                {courseGroupLabels[group].label}
              </Heading>
              <Text tone="muted">{courseGroupLabels[group].summary}</Text>
            </div>
            <ul aria-labelledby={headingId} className="grid gap-1.5 sm:grid-cols-2">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progress}
                  ready={ready}
                  examPassed={passed.has(course.id)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
