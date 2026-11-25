/** The deep family tones in tokens.css, for covers and drink backdrops. */
export type Tone =
  | "oxblood"
  | "charcoal"
  | "citrus"
  | "crimson"
  | "amber"
  | "copper"
  | "slate"
  | "emerald"
  | "teal"
  | "champagne"
  | "mocha";

export function toneVar(tone: Tone): string {
  return `var(--tone-${tone})`;
}
