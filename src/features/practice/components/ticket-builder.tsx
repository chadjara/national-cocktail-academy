import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

import { getIngredient } from "~/content";
import { Button, ChipGroup, Heading, ICON_STROKE, cn } from "~/design-system";
import { tapFeedback } from "~/lib/native";

import {
  CHOICE_FIELDS,
  formatDuration,
  type ChoiceField,
  type Ticket,
  type TicketAnswer,
  type TicketScore,
} from "../services/speed-round";

export const fieldLabels: Record<ChoiceField, string> = {
  glass: "Glass",
  ice: "Ice",
  method: "Method",
  garnish: "Garnish",
};

export function Clock({ startedAt, banked }: { startedAt: number; banked: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <>{formatDuration(banked + now - startedAt)}</>;
}

export function TicketResult({
  ticket,
  answer,
  score,
}: {
  ticket: Ticket;
  answer: TicketAnswer;
  score: TicketScore;
}) {
  const names = (ids: readonly string[]) => ids.map((id) => getIngredient(id).name).join(", ");
  const rows = [
    {
      label: "Ingredients",
      right: score.ingredientsRight,
      detail: score.ingredientsRight
        ? names(ticket.ingredients.correct)
        : [
            score.missing.length > 0 ? `Missing: ${names(score.missing)}` : "",
            score.extra.length > 0 ? `Not in it: ${names(score.extra)}` : "",
          ]
            .filter(Boolean)
            .join(". "),
    },
    ...CHOICE_FIELDS.map((field) => ({
      label: fieldLabels[field],
      right: score.fields[field],
      detail: score.fields[field]
        ? ticket.choices[field].answer
        : `${ticket.choices[field].answer} (you chose ${answer[field]})`,
    })),
  ];
  return (
    <ul aria-label={`${ticket.name} results`} className="flex flex-col divide-y divide-line">
      {rows.map((row) => (
        <li key={row.label} className="flex items-start gap-1.5 py-1">
          {row.right ? (
            <Check
              aria-hidden
              size={20}
              strokeWidth={ICON_STROKE}
              className="mt-0.5 shrink-0 text-success"
            />
          ) : (
            <X
              aria-hidden
              size={20}
              strokeWidth={ICON_STROKE}
              className="mt-0.5 shrink-0 text-danger"
            />
          )}
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-ink">
              {row.label}
              <span className="sr-only">{row.right ? ": right" : ": wrong"}</span>
            </span>
            <span className="text-sm text-ink-muted">{row.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

type Draft = { ingredients: string[] } & Partial<Record<ChoiceField, string>>;

/**
 * Builds one ticket from memory: ingredients first, then glass, ice, method
 * and garnish. A tap on an answer moves straight on, the way a bartender works
 * down a build. Key it by ticket so each ticket starts fresh.
 */
export function TicketBuilder({
  ticket,
  onSubmit,
}: {
  ticket: Ticket;
  onSubmit: (answer: TicketAnswer) => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ ingredients: [] });
  const field = CHOICE_FIELDS[step - 1];

  function choose(choice: ChoiceField, value: string) {
    tapFeedback();
    const next = { ...draft, [choice]: value };
    setDraft(next);
    if (step < CHOICE_FIELDS.length) {
      setStep(step + 1);
      return;
    }
    onSubmit({
      ingredients: next.ingredients,
      glass: next.glass ?? "",
      ice: next.ice ?? "",
      method: next.method ?? "",
      garnish: next.garnish ?? "",
    });
  }

  if (step === 0) {
    return (
      <div className="flex flex-col gap-2">
        <Heading as="h2" size="md" id="ingredients-step">
          Step 1 of 5: tap every ingredient in the spec
        </Heading>
        <ChipGroup
          label="Ingredients"
          layout="wrap"
          value={draft.ingredients}
          onValueChange={(ingredients) => setDraft({ ...draft, ingredients })}
          options={ticket.ingredients.options.map((option) => ({
            value: option.id,
            label: option.name,
          }))}
        />
        <Button
          className="self-start"
          disabled={draft.ingredients.length === 0}
          onClick={() => setStep(1)}
        >
          Next: glass
          <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
        </Button>
      </div>
    );
  }
  if (!field) return null;
  return (
    <div className="flex flex-col gap-2">
      <Heading as="h2" size="md" id="choice-step">
        Step {step + 1} of 5: {fieldLabels[field].toLowerCase()}
      </Heading>
      <ul aria-labelledby="choice-step" className="flex flex-col gap-1">
        {ticket.choices[field].options.map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => choose(field, option)}
              className={cn(
                "flex min-h-5.5 w-full items-center rounded-base border border-line-strong bg-raised px-1.5 py-1 text-left text-base text-ink",
                "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:border-accent hover:bg-accent-subtle",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
              )}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="self-start" onClick={() => setStep(step - 1)}>
        <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
        Back
      </Button>
    </div>
  );
}
