import { useCallback } from "react";

import { appConfig } from "~/config/app.config";
import { useLiveQuery } from "~/lib/db/use-live-query";

import { unitsRepository } from "../repositories/units-repository";
import type { UnitSystem } from "../services/units";

/**
 * The student's preferred units. Until the device answers (and in
 * prerendered HTML) this is the configured default, so text never blanks.
 */
export function useUnits(): { units: UnitSystem; setUnits: (next: UnitSystem) => void } {
  const state = useLiveQuery(() => unitsRepository.get(), []);
  const units = state.status === "ready" ? state.data : appConfig.units.default;
  const setUnits = useCallback((next: UnitSystem) => {
    void unitsRepository.set(next);
  }, []);
  return { units, setUnits };
}
