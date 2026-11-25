import { listCourses } from "~/content/curriculum";
import { Skeleton } from "~/design-system";

import { useExamStatuses } from "../hooks/use-exams";
import { useProgress } from "../hooks/use-progress";
import { passedExamIds } from "../services/exam-status";
import { ContinueCard } from "./continue-card";

/** Today's lead: the next lesson to take. Holds its space while the device answers. */
export function TodayLearning() {
  const progress = useProgress();
  const exams = useExamStatuses();
  if (progress.status === "loading" || exams.status === "loading")
    return <Skeleton className="h-22" />;
  if (progress.status === "error") return null;
  return <ContinueCard progress={progress.data} passedExams={passedExamIds(exams)} />;
}

export const courseCount = listCourses().length;
