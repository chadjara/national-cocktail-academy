import { useCallback } from "react";

import type { CapstoneAttemptRecord } from "~/lib/db/records";
import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";

import { capstoneRepository } from "../repositories/capstone-repository";
import { isBetterRun } from "../services/speed-round";

export type CapstoneStatus = {
  attempts: number;
  passed: boolean;
  /** Best shift: most points, then fastest. */
  best: CapstoneAttemptRecord | undefined;
};

export function summarizeCapstone(attempts: readonly CapstoneAttemptRecord[]): CapstoneStatus {
  let best: CapstoneAttemptRecord | undefined;
  for (const attempt of attempts) if (isBetterRun(attempt, best)) best = attempt;
  return { attempts: attempts.length, passed: attempts.some((a) => a.passed), best };
}

export function useCapstoneStatus(): LiveQueryState<CapstoneStatus> {
  return useLiveQuery(async () => summarizeCapstone(await capstoneRepository.list()), []);
}

export function useSaveCapstone(): (attempt: Omit<CapstoneAttemptRecord, "id">) => Promise<void> {
  return useCallback((attempt) => capstoneRepository.add(attempt), []);
}
