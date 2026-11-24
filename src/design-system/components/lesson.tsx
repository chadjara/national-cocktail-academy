import { Check, CircleAlert, Lightbulb, X } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "../cn";
import { ICON_STROKE } from "./icon";

/** A behind-the-bar tip or a safety warning set apart from the lesson text. */
export function Callout({
  tone,
  title,
  children,
}: {
  tone: "tip" | "warning";
  title: string;
  children: ReactNode;
}) {
  const Icon = tone === "tip" ? Lightbulb : CircleAlert;
  return (
    <aside
      className={cn(
        "flex gap-1.5 rounded-base border-l-2 p-2",
        tone === "tip" ? "border-accent bg-accent-subtle" : "border-warning bg-warning-subtle",
      )}
    >
      <Icon
        aria-hidden
        size={20}
        strokeWidth={ICON_STROKE}
        className={cn("mt-0.5 shrink-0", tone === "tip" ? "text-accent-text" : "text-warning")}
      />
      <div className="flex flex-col gap-0.5">
        <p className="text-heading-sm font-semibold text-ink">
          <span className="sr-only">{tone === "tip" ? "Tip: " : "Warning: "}</span>
          {title}
        </p>
        <p className="text-base text-ink-muted">{children}</p>
      </div>
    </aside>
  );
}

/** Numbered how-to steps, with large numerals a student can follow at the bar. */
export function StepList({ title, items }: { title: string; items: readonly string[] }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-1.5">
      <h3 id={id} className="text-heading-sm font-semibold text-ink">
        {title}
      </h3>
      <ol className="flex flex-col gap-1.5">
        {items.map((item, index) => (
          <li key={item} className="flex gap-1.5">
            <span
              aria-hidden
              className="inline-flex size-3 shrink-0 items-center justify-center rounded-full bg-sunken text-sm font-semibold text-ink-muted tabular"
            >
              {index + 1}
            </span>
            <span className="text-base text-ink">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The few things to remember from a lesson, as a ruled list. */
export function KeyPoints({ title, items }: { title: string; items: readonly string[] }) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-1 rounded-base border border-line bg-surface p-2"
    >
      <h3
        id={id}
        className="text-caption font-semibold tracking-(--text-caption--letter-spacing) text-ink-subtle uppercase"
      >
        {title}
      </h3>
      <ul className="flex flex-col divide-y divide-line">
        {items.map((item) => (
          <li key={item} className="py-1 text-base text-ink">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type ChoiceResult = "correct" | "incorrect";

/**
 * A multiple-choice question that teaches rather than grades: a wrong pick is
 * marked and the student tries again; the explanation appears once they find
 * the right answer. Options stay focusable after a wrong pick (aria-disabled,
 * not disabled) so keyboard and VoiceOver users never lose their place.
 */
export function ChoiceQuestion({
  prompt,
  options,
  answer,
  explanation,
  number,
  onAnswer,
}: {
  prompt: string;
  options: readonly string[];
  answer: number;
  explanation: string;
  /** Shown before the prompt, e.g. "Question 2 of 5". */
  number?: string;
  onAnswer?: (result: ChoiceResult) => void;
}) {
  const id = useId();
  const [wrong, setWrong] = useState<ReadonlySet<number>>(new Set());
  const [solved, setSolved] = useState(false);
  const lastWrong = wrong.size > 0 && !solved;

  function pick(index: number) {
    if (solved || wrong.has(index)) return;
    if (index === answer) {
      setSolved(true);
      onAnswer?.("correct");
    } else {
      setWrong(new Set([...wrong, index]));
      onAnswer?.("incorrect");
    }
  }

  return (
    <fieldset
      aria-describedby={`${id}-feedback`}
      className={cn(
        "flex flex-col gap-1.5 rounded-base border p-2 transition-colors duration-(--duration-fast) ease-(--ease-out)",
        solved ? "border-success bg-success-subtle/40" : "border-line bg-surface",
      )}
    >
      {/* Floated so the legend sits inside the padded box instead of on the border. */}
      <legend className="float-left mb-1.5 flex w-full flex-col gap-0.5">
        {number !== undefined && (
          <span className="block text-caption font-semibold tracking-(--text-caption--letter-spacing) text-ink-subtle uppercase">
            {number}
          </span>
        )}
        <span className="block text-heading-sm font-semibold text-ink">{prompt}</span>
      </legend>
      <ul className="clear-both flex flex-col gap-1">
        {options.map((option, index) => {
          const isAnswer = solved && index === answer;
          const isWrong = wrong.has(index);
          const inactive = solved || isWrong;
          return (
            <li key={option}>
              <button
                type="button"
                aria-disabled={inactive || undefined}
                onClick={() => pick(index)}
                className={cn(
                  "flex min-h-5.5 w-full items-center gap-1.5 rounded-base border px-1.5 py-1 text-left text-base",
                  "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  isAnswer && "border-success bg-success-subtle font-semibold text-ink",
                  isWrong && "border-line bg-sunken text-ink-subtle line-through decoration-1",
                  !isAnswer && !isWrong && "border-line-strong bg-raised text-ink",
                  !inactive && "hover:border-accent hover:bg-accent-subtle active:bg-accent-subtle",
                  solved && !isAnswer && "opacity-60",
                )}
              >
                <span className="flex-1">{option}</span>
                {isAnswer && (
                  <Check aria-hidden size={20} strokeWidth={ICON_STROKE} className="text-success" />
                )}
                {isWrong && (
                  <X aria-hidden size={20} strokeWidth={ICON_STROKE} className="text-danger" />
                )}
                {isAnswer && <span className="sr-only">(correct)</span>}
                {isWrong && <span className="sr-only">(incorrect)</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div id={`${id}-feedback`} role="status" aria-live="polite" className="text-base">
        {solved && (
          <p className="text-ink">
            <span className="font-semibold text-success">Correct. </span>
            {explanation}
          </p>
        )}
        {lastWrong && <p className="font-medium text-danger">Not quite. Try another answer.</p>}
      </div>
    </fieldset>
  );
}
