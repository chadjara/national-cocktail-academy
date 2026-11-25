import { useCallback } from "react";

import type { ExamAttemptRecord } from "~/lib/db/records";
import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";

import { examRepository } from "../repositories/exam-repository";

export type ExamStatus = {
  attempts: number;
  /** The best-scoring attempt. */
  best: ExamAttemptRecord | undefined;
  latest: ExamAttemptRecord | undefined;
  passed: boolean;
};

export type ExamStatuses = ReadonlyMap<string, ExamStatus>;

export function summarizeExams(attempts: readonly ExamAttemptRecord[]): ExamStatuses {
  const byCourse = new Map<string, ExamStatus>();
  for (const attempt of attempts) {
    const current = byCourse.get(attempt.courseId) ?? {
      attempts: 0,
      best: undefined,
      latest: attempt,
      passed: false,
    };
    const better =
      !current.best || attempt.score / attempt.total > current.best.score / current.best.total;
    byCourse.set(attempt.courseId, {
      attempts: current.attempts + 1,
      best: better ? attempt : current.best,
      latest: current.latest,
      passed: current.passed || attempt.passed,
    });
  }
  return byCourse;
}

/** Exam results for every course, live. Attempts arrive newest first, so `latest` is the first seen. */
export function useExamStatuses(): LiveQueryState<ExamStatuses> {
  return useLiveQuery(async () => summarizeExams(await examRepository.list()), []);
}

export function useSaveExam(): (attempt: Omit<ExamAttemptRecord, "id">) => Promise<void> {
  return useCallback((attempt) => examRepository.add(attempt), []);
}
