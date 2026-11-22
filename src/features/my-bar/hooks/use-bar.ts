import { useCallback } from "react";

import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";

import { barRepository } from "../repositories/bar-repository";

export function useBar(): {
  stocked: LiveQueryState<ReadonlySet<string>>;
  setStocked: (ingredientId: string, stocked: boolean) => void;
  clear: () => void;
} {
  const stocked = useLiveQuery(async () => new Set(await barRepository.listIds()), []);
  const setStocked = useCallback((ingredientId: string, value: boolean) => {
    void barRepository.setStocked(ingredientId, value);
  }, []);
  const clear = useCallback(() => {
    void barRepository.clear();
  }, []);
  return { stocked, setStocked, clear };
}
