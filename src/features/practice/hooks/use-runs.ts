import { useCallback } from "react";

import type { PracticeKind, PracticeRunRecord } from "~/lib/db/records";
import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";

import { runsRepository } from "../repositories/runs-repository";
import { isBetterRun } from "../services/speed-round";

export type RunStats = {
  count: number;
  best: PracticeRunRecord | undefined;
  latest: PracticeRunRecord | undefined;
  /** Mean score as a share of the total over the last ten runs, 0–1. */
  recentAccuracy: number | undefined;
};

export function summarizeRuns(runs: readonly PracticeRunRecord[]): RunStats {
  let best: PracticeRunRecord | undefined;
  for (const run of runs) if (isBetterRun(run, best)) best = run;
  const recent = runs.slice(0, 10);
  return {
    count: runs.length,
    best,
    latest: runs[0],
    recentAccuracy:
      recent.length === 0
        ? undefined
        : recent.reduce((sum, run) => sum + run.score / run.total, 0) / recent.length,
  };
}

export function useRuns(kind: PracticeKind): LiveQueryState<RunStats> {
  return useLiveQuery(async () => summarizeRuns(await runsRepository.list(kind)), [kind]);
}

export function useRecordRun(): (run: Omit<PracticeRunRecord, "id" | "finishedAt">) => void {
  return useCallback((run) => {
    void runsRepository.add({ ...run, finishedAt: new Date().toISOString() });
  }, []);
}
