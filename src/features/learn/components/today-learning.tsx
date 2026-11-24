import { listCourses } from "~/content/curriculum";
import { Skeleton } from "~/design-system";

import { useProgress } from "../hooks/use-progress";
import { ContinueCard } from "./continue-card";

/** Today's lead: the next lesson to take. Holds its space while the device answers. */
export function TodayLearning() {
  const progress = useProgress();
  if (progress.status === "loading") return <Skeleton className="h-22" />;
  if (progress.status === "error") return null;
  return <ContinueCard progress={progress.data} />;
}

export const courseCount = listCourses().length;
