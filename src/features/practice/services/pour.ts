import { appConfig } from "~/config/app.config";
import { sample, type Random } from "~/lib/rng";

import { mlToOz, type UnitSystem } from "../../library/services/units";

/** The count most bars teach with a standard speed pourer: a steady four-count pours about 1 oz. */
export const COUNTS_PER_OZ = 4;

/** Common pours, in ounces. */
export const POUR_TARGETS_OZ: readonly number[] = [0.5, 0.75, 1, 1.5, 2];

export const POURS_PER_ROUND = 5;

export function countsFor(oz: number): number {
  return oz * COUNTS_PER_OZ;
}

export function formatPour(oz: number, units: UnitSystem): string {
  const ml = oz * appConfig.units.mlPerOz;
  return units === "oz" ? `${mlToOz(ml)} oz` : `${String(Math.round(ml * 10) / 10)} ml`;
}

/** Points for a pour: 2 within ⅛ oz of the target, 1 within ¼ oz, otherwise 0. */
export function scorePour(targetOz: number, pouredOz: number): number {
  const error = Math.abs(pouredOz - targetOz);
  if (error <= 0.125 + 1e-9) return 2;
  if (error <= 0.25 + 1e-9) return 1;
  return 0;
}

/** What a held pour measures, given the student's own calibrated time for a four-count. */
export function heldToOz(heldMs: number, msPerOz: number): number {
  return msPerOz <= 0 ? 0 : heldMs / msPerOz;
}

/** Averages calibration holds, ignoring a slip that's far off the others. */
export function calibrate(holdsMs: readonly number[]): number {
  if (holdsMs.length === 0) return 0;
  const sorted = [...holdsMs].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const kept = sorted.filter((ms) => Math.abs(ms - median) <= median * 0.35);
  return kept.reduce((sum, ms) => sum + ms, 0) / kept.length;
}

export function pourTargets(random: Random): number[] {
  return Array.from({ length: POURS_PER_ROUND }, () => sample(POUR_TARGETS_OZ, 1, random)[0] ?? 1);
}

/** The readings a student can log after pouring water into a jigger, from ½ oz under to ½ oz over. */
export function readingOptions(targetOz: number): number[] {
  return [-0.5, -0.25, -0.125, 0, 0.125, 0.25, 0.5]
    .map((delta) => targetOz + delta)
    .filter((oz) => oz > 0);
}

/** "On target", "⅛ oz over", "¼ oz under": a reading relative to the target. */
export function describeError(targetOz: number, pouredOz: number, units: UnitSystem): string {
  const delta = pouredOz - targetOz;
  if (Math.abs(delta) < 1e-9) return "On target";
  return `${formatPour(Math.abs(delta), units)} ${delta > 0 ? "over" : "under"}`;
}
