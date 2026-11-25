import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { colorGroups } from "~/features/design-system-docs/token-catalog";

// Read from disk: Vitest stubs CSS imports, including ?raw.
const css = readFileSync(resolve(process.cwd(), "src/design-system/tokens/tokens.css"), "utf8");

function block(selectorPattern: RegExp): Map<string, string> {
  const match = selectorPattern.exec(css);
  if (!match?.[1]) throw new Error(`Token block not found: ${selectorPattern.source}`);
  const tokens = new Map<string, string>();
  for (const [, name, value] of match[1].matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
    if (name && value) tokens.set(name, value.trim());
  }
  return tokens;
}

const light = block(/^:root \{([\s\S]*?)\n\}/m);
const darkFromMedia = block(/:root:not\(\[data-theme="light"\]\) \{([\s\S]*?)\n {2}\}/);
const darkExplicit = block(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/);

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Text that must meet WCAG AA (4.5:1) on every surface it can appear on. */
const textOnSurfaces = [
  "ink",
  "ink-muted",
  "ink-subtle",
  "accent-text",
  "success",
  "warning",
  "danger",
  "brass",
];
const surfaces = ["canvas", "surface", "raised"];
const pairs: Array<[string, string]> = [
  ["on-accent", "accent"],
  ["on-accent", "accent-hover"],
  ["accent-text", "accent-subtle"],
  ["success", "success-subtle"],
  ["warning", "warning-subtle"],
  ["danger", "danger-subtle"],
  ["brass", "brass-subtle"],
  ["ink-muted", "sunken"],
  ["canvas", "danger"],
];

describe.each([
  ["light", light],
  ["dark", darkExplicit],
])("%s theme contrast (WCAG 2.2 AA)", (_theme, tokens) => {
  const get = (name: string) => {
    const value = tokens.get(name);
    if (!value?.startsWith("#")) throw new Error(`Missing hex token --${name}`);
    return value;
  };

  for (const text of textOnSurfaces) {
    for (const surface of surfaces) {
      it(`${text} on ${surface} is at least 4.5:1`, () => {
        expect(contrast(get(text), get(surface))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  for (const [fg, bg] of pairs) {
    it(`${fg} on ${bg} is at least 4.5:1`, () => {
      expect(contrast(get(fg), get(bg))).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("focus ring meets 3:1 against the page (non-text contrast)", () => {
    expect(contrast(get("focus"), get("canvas"))).toBeGreaterThanOrEqual(3);
  });
});

describe("family tones", () => {
  const tones = new Map(
    [...css.matchAll(/--(tone-[a-z]+):\s*(#[0-9a-f]{6});/g)].map(([, name, value]) => [
      name ?? "",
      value ?? "",
    ]),
  );

  it("defines a tone for every family", () => {
    expect(tones.size).toBeGreaterThanOrEqual(11);
  });

  it.each([...tones])("white text on %s is at least 4.5:1", (_name, value) => {
    expect(contrast("#ffffff", value)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("token definitions", () => {
  it("keeps the OS-preference and explicit dark palettes identical", () => {
    expect(Object.fromEntries(darkFromMedia)).toEqual(Object.fromEntries(darkExplicit));
  });

  it("defines every light token in dark mode too", () => {
    expect([...darkExplicit.keys()].sort()).toEqual([...light.keys()].sort());
  });

  it("documents only tokens that exist", () => {
    for (const token of colorGroups.flatMap((group) => group.tokens)) {
      expect(light.has(token.name), token.name).toBe(true);
    }
  });
});
