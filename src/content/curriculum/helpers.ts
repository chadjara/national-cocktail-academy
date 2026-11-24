import type { BlockInput } from "./schema";

/**
 * Authors a multiple-choice question. The correct option is written first for
 * readability; the lesson player shuffles options with a seed per question, so
 * the right answer never sits in a predictable spot.
 */
export function ask(
  prompt: string,
  correct: string,
  wrong: readonly string[],
  explanation: string,
): BlockInput {
  return {
    kind: "question",
    question: { prompt, options: [correct, ...wrong], answer: 0, explanation },
  };
}

export function text(...paragraphs: string[]): BlockInput {
  return { kind: "text", paragraphs };
}

export function points(items: string[], title = "Remember"): BlockInput {
  return { kind: "key-points", title, items };
}

export function tip(title: string, body: string): BlockInput {
  return { kind: "callout", tone: "tip", title, text: body };
}

export function warning(title: string, body: string): BlockInput {
  return { kind: "callout", tone: "warning", title, text: body };
}

export function steps(title: string, items: string[]): BlockInput {
  return { kind: "steps", title, items };
}
