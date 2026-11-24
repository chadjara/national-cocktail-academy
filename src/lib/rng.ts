/**
 * Deterministic pseudo-random numbers. Quizzes generated from content must be
 * the same every time a lesson opens (and in tests), so randomness is always
 * seeded from a stable string such as a lesson id.
 */

/** FNV-1a: turns a string into a 32-bit seed. */
export function hashSeed(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export type Random = () => number;

/** mulberry32: small, fast, good enough for shuffling quiz options. */
export function seededRandom(seed: string | number): Random {
  let state = typeof seed === "number" ? seed >>> 0 : hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(items: readonly T[], random: Random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap] as T, result[index] as T];
  }
  return result;
}

/** Up to `count` distinct items, in random order. */
export function sample<T>(items: readonly T[], count: number, random: Random): T[] {
  return shuffle(items, random).slice(0, count);
}
