import { CircleCheck, Trophy } from "lucide-react";
import { Link } from "react-router";

import {
  courseGroupLabels,
  listCourses,
  type Course,
  type CourseGroup,
} from "~/content/curriculum";
import { Badge, Card, CoverImage, Heading, ICON_STROKE, ProgressBar, Text } from "~/design-system";

import { useExamStatuses } from "../hooks/use-exams";
import { useProgress } from "../hooks/use-progress";
import { passedExamIds } from "../services/exam-status";
import { courseArt } from "../services/course-art";
import { courseProgress, emptyProgress, type Progress } from "../services/progress";
import { CapstoneSection } from "~/features/certificate/components/capstone-section";

import { ContinueCard } from "./continue-card";

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
  const art = courseArt(course);
  return (
    <Card as="li" interactive padding="none" className="flex h-full flex-col overflow-hidden">
      <CoverImage src={art.photo?.src} alt="" tone={art.tone} aspect="16/9" rounded={false}>
        <div className="absolute top-1.5 right-1.5">
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
      </CoverImage>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
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
      </div>
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
      <CapstoneSection />
    </div>
  );
}
