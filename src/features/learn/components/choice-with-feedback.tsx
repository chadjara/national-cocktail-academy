import type { ScenarioOutcome } from "~/content/scenarios";
import { Callout, cn, type CalloutTone } from "~/design-system";

export const outcomeFeedback: Record<ScenarioOutcome, { tone: CalloutTone; title: string }> = {
  best: { tone: "success", title: "Good call" },
  acceptable: { tone: "warning", title: "Okay, but there's a better way" },
  unsafe: { tone: "danger", title: "Unsafe" },
};

type Choice = { text: string; outcome: ScenarioOutcome; feedback: string };

/**
 * A list of responses to a guest situation. Once one is picked the others
 * dim and the pick's feedback appears, toned by how safe it was.
 */
export function ChoiceWithFeedback<C extends Choice>({
  labelledBy,
  choices,
  picked,
  onPick,
}: {
  labelledBy: string;
  choices: readonly C[];
  picked: C | null;
  onPick: (choice: C) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <ul aria-labelledby={labelledBy} className="flex flex-col gap-1">
        {choices.map((choice) => {
          const chosen = picked === choice;
          return (
            <li key={choice.text}>
              <button
                type="button"
                aria-pressed={chosen}
                aria-disabled={picked !== null || undefined}
                onClick={() => {
                  if (picked === null) onPick(choice);
                }}
                className={cn(
                  "flex min-h-5.5 w-full items-center rounded-base border px-1.5 py-1 text-left text-base",
                  "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  chosen && "border-accent bg-accent-subtle font-semibold text-ink",
                  !chosen && "border-line-strong bg-raised text-ink",
                  picked === null && "hover:border-accent hover:bg-accent-subtle",
                  picked !== null && !chosen && "opacity-60",
                )}
              >
                {choice.text}
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite">
        {picked && (
          <Callout
            tone={outcomeFeedback[picked.outcome].tone}
            title={outcomeFeedback[picked.outcome].title}
          >
            {picked.feedback}
          </Callout>
        )}
      </div>
    </div>
  );
}
