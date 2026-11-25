import type { Course, Lesson } from "~/content/curriculum";

/** What the student has finished, as read from the device. */
export type Progress = {
  /** Keys of finished lessons: `${courseId}/${lessonId}`. */
  completed: ReadonlySet<string>;
  /** The most recently finished lesson, if any. */
  latest: { courseId: string; lessonId: string } | undefined;
};

export const emptyProgress: Progress = { completed: new Set(), latest: undefined };

export function lessonKey(courseId: string, lessonId: string): string {
  return `${courseId}/${lessonId}`;
}

export function isLessonComplete(progress: Progress, courseId: string, lessonId: string): boolean {
  return progress.completed.has(lessonKey(courseId, lessonId));
}

export function courseProgress(
  course: Course,
  progress: Progress,
): { done: number; total: number } {
  const done = course.lessons.filter((lesson) =>
    isLessonComplete(progress, course.id, lesson.id),
  ).length;
  return { done, total: course.lessons.length };
}

/** The first unfinished lesson in a course, or undefined if it's finished. */
export function nextLessonIn(course: Course, progress: Progress): Lesson | undefined {
  return course.lessons.find((lesson) => !isLessonComplete(progress, course.id, lesson.id));
}

export type Recommendation =
  | { kind: "lesson"; course: Course; lesson: Lesson; started: boolean }
  | { kind: "exam"; course: Course };

/**
 * Where to pick up: the course the student was last working in, if it still
 * has a lesson left or an exam to pass; otherwise the first course in the
 * recommended order that does. Undefined once every lesson is finished and
 * every exam passed.
 */
export function recommendNext(
  courses: readonly Course[],
  progress: Progress,
  passedExams: ReadonlySet<string>,
): Recommendation | undefined {
  const current =
    progress.latest && courses.find((course) => course.id === progress.latest?.courseId);
  const ordered = current ? [current, ...courses.filter((course) => course !== current)] : courses;
  for (const course of ordered) {
    const lesson = nextLessonIn(course, progress);
    if (lesson) {
      return { kind: "lesson", course, lesson, started: courseProgress(course, progress).done > 0 };
    }
    if (!passedExams.has(course.id)) return { kind: "exam", course };
  }
  return undefined;
}
