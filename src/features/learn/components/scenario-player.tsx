import { ArrowRight, MessageSquareQuote, RotateCcw } from "lucide-react";
import { useState } from "react";

import type { Scenario, ScenarioChoice, ScenarioOutcome } from "~/content/scenarios";
import {
  Button,
  Callout,
  Card,
  Eyebrow,
  Heading,
  ICON_STROKE,
  Text,
  cn,
  type CalloutTone,
} from "~/design-system";
import { tapFeedback } from "~/lib/native";

const outcomeFeedback: Record<ScenarioOutcome, { tone: CalloutTone; title: string }> = {
  best: { tone: "success", title: "Good call" },
  acceptable: { tone: "warning", title: "Okay, but there's a better way" },
  unsafe: { tone: "danger", title: "Unsafe" },
};

/**
 * Plays one branching scenario. Each pick is explained before moving on. A
 * scenario counts as passed only when it's finished without an unsafe choice;
 * otherwise the student replays it.
 */
export function ScenarioPlayer({
  scenario,
  onFinish,
}: {
  scenario: Scenario;
  /** Called each time the scenario reaches an end. `passed` is false if any choice was unsafe. */
  onFinish: (passed: boolean) => void;
}) {
  const [nodeId, setNodeId] = useState(scenario.start);
  const [picked, setPicked] = useState<ScenarioChoice | null>(null);
  const [unsafe, setUnsafe] = useState(false);
  const [ended, setEnded] = useState<"passed" | "replay" | null>(null);
  const [attempt, setAttempt] = useState(1);
  const node = scenario.nodes.find((n) => n.id === nodeId);
  const headingId = `scenario-${scenario.id}`;

  function pick(choice: ScenarioChoice) {
    if (picked) return;
    tapFeedback();
    setPicked(choice);
    if (choice.outcome === "unsafe") setUnsafe(true);
  }

  function next() {
    if (!picked) return;
    if (picked.next) {
      setNodeId(picked.next);
      setPicked(null);
      return;
    }
    const passed = !unsafe && picked.outcome !== "unsafe";
    setEnded(passed ? "passed" : "replay");
    onFinish(passed);
  }

  function replay() {
    setNodeId(scenario.start);
    setPicked(null);
    setUnsafe(false);
    setEnded(null);
    setAttempt((count) => count + 1);
  }

  return (
    <Card as="section" aria-labelledby={headingId} className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <Eyebrow tone="accent">
          Scenario{attempt > 1 ? ` · attempt ${String(attempt)}` : ""}
        </Eyebrow>
        <Heading as="h2" size="md" id={headingId}>
          {scenario.title}
        </Heading>
        <Text size="sm" tone="muted">
          {scenario.setting}
        </Text>
      </div>

      {ended ? (
        <div aria-live="polite" className="flex flex-col gap-1.5">
          {ended === "passed" ? (
            <Callout tone="success" title="Scenario complete">
              You handled it safely. Every step you'd take behind a real bar.
            </Callout>
          ) : (
            <Callout tone="danger" title="Try it again">
              One of your choices was unsafe. Replay the scenario and look for the safe response at
              each step.
            </Callout>
          )}
          <Button
            variant={ended === "passed" ? "ghost" : "primary"}
            className="self-start"
            onClick={replay}
            leadingIcon={<RotateCcw aria-hidden size={18} strokeWidth={ICON_STROKE} />}
          >
            {ended === "passed" ? "Play again" : "Replay the scenario"}
          </Button>
        </div>
      ) : (
        node && (
          <div className="flex flex-col gap-1.5">
            <blockquote className="flex gap-1.5 rounded-base bg-sunken p-1.5 text-base text-ink">
              <MessageSquareQuote
                aria-hidden
                size={20}
                strokeWidth={ICON_STROKE}
                className="mt-0.5 shrink-0 text-ink-subtle"
              />
              <span>{node.guest}</span>
            </blockquote>
            <p id={`${headingId}-${node.id}`} className="text-sm font-semibold text-ink">
              What do you do?
            </p>
            <ul aria-labelledby={`${headingId}-${node.id}`} className="flex flex-col gap-1">
              {node.choices.map((choice) => {
                const chosen = picked === choice;
                return (
                  <li key={choice.text}>
                    <button
                      type="button"
                      aria-pressed={chosen}
                      aria-disabled={picked !== null || undefined}
                      onClick={() => pick(choice)}
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
            <div aria-live="polite" className="flex flex-col gap-1.5">
              {picked && (
                <>
                  <Callout
                    tone={outcomeFeedback[picked.outcome].tone}
                    title={outcomeFeedback[picked.outcome].title}
                  >
                    {picked.feedback}
                  </Callout>
                  <Button className="self-start" onClick={next}>
                    {picked.next ? "Continue" : "Finish"}
                    <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      )}
    </Card>
  );
}
