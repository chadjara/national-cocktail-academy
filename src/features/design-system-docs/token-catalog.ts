/**
 * Documentation metadata for the color tokens defined in tokens.css. The
 * test suite checks that every token listed here exists in both themes.
 */
export type ColorToken = { name: string; usage: string };
export type ColorGroup = { title: string; tokens: readonly ColorToken[] };

export const colorGroups: readonly ColorGroup[] = [
  {
    title: "Surfaces",
    tokens: [
      { name: "canvas", usage: "Page background" },
      { name: "surface", usage: "Cards and grouped content" },
      { name: "raised", usage: "Inputs, menus, dialogs" },
      { name: "sunken", usage: "Wells, tracks, pressed states" },
    ],
  },
  {
    title: "Ink and lines",
    tokens: [
      { name: "ink", usage: "Primary text and icons" },
      { name: "ink-muted", usage: "Secondary text" },
      { name: "ink-subtle", usage: "Hints, placeholders, metadata" },
      { name: "line", usage: "Dividers and card borders" },
      { name: "line-strong", usage: "Control borders" },
    ],
  },
  {
    title: "Accent",
    tokens: [
      { name: "accent", usage: "Primary actions, selection" },
      { name: "accent-text", usage: "Links and accent text" },
      { name: "accent-subtle", usage: "Accent backgrounds" },
      { name: "brass", usage: "Certification and achievement only" },
      { name: "brass-subtle", usage: "Achievement backgrounds" },
    ],
  },
  {
    title: "State",
    tokens: [
      { name: "success", usage: "Correct, passed, complete" },
      { name: "success-subtle", usage: "Success backgrounds" },
      { name: "warning", usage: "Due soon, needs attention" },
      { name: "warning-subtle", usage: "Warning backgrounds" },
      { name: "danger", usage: "Incorrect, failed, destructive" },
      { name: "danger-subtle", usage: "Danger backgrounds" },
    ],
  },
];

export const typeScale = [
  {
    token: "display-xl",
    className: "font-display-optical text-display-lg md:text-display-xl tracking-[-0.02em]",
    sample: "Stirred, not shaken",
  },
  {
    token: "display-lg",
    className: "font-display-optical text-display-md md:text-display-lg tracking-[-0.02em]",
    sample: "The Classics by Family",
  },
  {
    token: "display-md",
    className: "font-display-optical text-display-sm md:text-display-md tracking-[-0.02em]",
    sample: "Sours and their descendants",
  },
  {
    token: "display-sm",
    className: "font-display-optical text-display-sm tracking-[-0.02em]",
    sample: "Daiquiri",
  },
  {
    token: "heading-lg",
    className: "font-display-optical text-heading-lg font-medium",
    sample: "Build order",
  },
  {
    token: "heading-md",
    className: "text-heading-md font-semibold tracking-[-0.01em]",
    sample: "Shake hard for twelve seconds",
  },
  {
    token: "heading-sm",
    className: "text-heading-sm font-semibold",
    sample: "Glass: chilled coupe",
  },
  {
    token: "lg",
    className: "text-lg",
    sample:
      "A sour is spirit, citrus and sugar. Get the balance right and you can make a hundred drinks.",
  },
  {
    token: "base",
    className: "text-base",
    sample:
      "Measure the cheapest ingredients first. If you mis-pour, you've wasted lime juice, not a premium rum.",
  },
  {
    token: "sm",
    className: "text-sm",
    sample: "60 ml white rum · 22.5 ml lime · 22.5 ml simple syrup",
  },
  {
    token: "caption",
    className: "eyebrow",
    sample: "Difficulty · Intermediate",
  },
] as const;

export const spacingScale = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12] as const;
