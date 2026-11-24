import { useCallback } from "react";

import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";

import { progressRepository } from "../repositories/progress-repository";
import type { Progress } from "../services/progress";

/** The student's finished lessons, live from the device. */
export function useProgress(): LiveQueryState<Progress> {
  return useLiveQuery(async (): Promise<Progress> => {
    const rows = await progressRepository.list();
    const [latest] = rows;
    return {
      completed: new Set(rows.map((row) => row.id)),
      latest: latest && { courseId: latest.courseId, lessonId: latest.lessonId },
    };
  }, []);
}

export function useLessonActions(): {
  complete: (courseId: string, lessonId: string) => void;
  resetCourse: (courseId: string) => void;
} {
  const complete = useCallback((courseId: string, lessonId: string) => {
    void progressRepository.complete(courseId, lessonId);
  }, []);
  const resetCourse = useCallback((courseId: string) => {
    void progressRepository.resetCourse(courseId);
  }, []);
  return { complete, resetCourse };
}
