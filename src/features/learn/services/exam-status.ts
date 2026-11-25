import type { LiveQueryState } from "~/lib/db/use-live-query";

import type { ExamStatuses } from "../hooks/use-exams";

/** Courses whose exam has been passed. Empty until the device answers. */
export function passedExamIds(state: LiveQueryState<ExamStatuses>): ReadonlySet<string> {
  if (state.status !== "ready") return new Set();
  return new Set(
    [...state.data].flatMap(([courseId, status]) => (status.passed ? [courseId] : [])),
  );
}
