import { ArrowLeft, ArrowRight, Check, Timer, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { getIngredient } from "~/content";
import {
  Badge,
  Button,
  Card,
  ChipGroup,
  Display,
  Eyebrow,
  Heading,
  ICON_STROKE,
  ProgressBar,
  Text,
  TicketCard,
  cn,
} from "~/design-system";
import { useUnits } from "~/features/library/hooks/use-units";
import { useLiveQuery } from "~/lib/db/use-live-query";
import { tapFeedback } from "~/lib/native";

import { useRecordRun, useRuns } from "../hooks/use-runs";
import { reviewRepository } from "../repositories/review-repository";
import {
  CHOICE_FIELDS,
  formatDuration,
  isBetterRun,
  makeRound,
  POINTS_PER_TICKET,
  scoreTicket,
  type ChoiceField,
  type Ticket,
  type TicketAnswer,
  type TicketScore,
} from "../services/speed-round";

const fieldLabels: Record<ChoiceField, string> = {
  glass: "Glass",
  ice: "Ice",
  method: "Method",
  garnish: "Garnish",
};

type Draft = { ingredients: string[] } & Partial<Record<ChoiceField, string>>;

function Clock({ startedAt, banked }: { startedAt: number; banked: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <>{formatDuration(banked + now - startedAt)}</>;
}

function TicketResult({
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

type Phase =
  | { kind: "ready" }
  | { kind: "building"; startedAt: number }
  | { kind: "checked" }
  | { kind: "finished"; newBest: boolean };

/**
 * Speed Round: five tickets, built from memory against the clock. Each ticket
 * is a short sequence (ingredients, then glass, ice, method and garnish); a
 * tap on an answer moves straight on, the way a bartender works down a build.
 */
export function SpeedRound() {
  const { units } = useUnits();
  const learned = useLiveQuery(async () => [...(await reviewRepository.enrolledCocktailIds())], []);
  const stats = useRuns("speed-round");
  const record = useRecordRun();

  const [seed, setSeed] = useState<string | null>(null);
  const tickets = useMemo(
    () =>
      seed === null ? [] : makeRound(learned.status === "ready" ? learned.data : [], units, seed),
    // A round is dealt once per seed; changing units mid-round must not redeal it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );
  const [phase, setPhase] = useState<Phase>({ kind: "ready" });
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ ingredients: [] });
  const [results, setResults] = useState<{ answer: TicketAnswer; score: TicketScore }[]>([]);
  const [banked, setBanked] = useState(0);

  const ticket = tickets[index];
  const best = stats.status === "ready" ? stats.data.best : undefined;
  const totalPoints = results.reduce((sum, result) => sum + result.score.points, 0);
  const maxPoints = tickets.length * POINTS_PER_TICKET;

  function start() {
    tapFeedback();
    setSeed(String(Date.now()));
    setIndex(0);
    setStep(0);
    setDraft({ ingredients: [] });
    setResults([]);
    setBanked(0);
    setPhase({ kind: "building", startedAt: Date.now() });
  }

  function check(final: Draft) {
    if (!ticket || phase.kind !== "building") return;
    const answer: TicketAnswer = {
      ingredients: final.ingredients,
      glass: final.glass ?? "",
      ice: final.ice ?? "",
      method: final.method ?? "",
      garnish: final.garnish ?? "",
    };
    setBanked((ms) => ms + Date.now() - phase.startedAt);
    setResults((list) => [...list, { answer, score: scoreTicket(ticket, answer) }]);
    setPhase({ kind: "checked" });
  }

  function choose(field: ChoiceField, value: string) {
    tapFeedback();
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (step >= CHOICE_FIELDS.length) check(next);
    else setStep(step + 1);
  }

  function nextTicket() {
    if (index + 1 < tickets.length) {
      setIndex(index + 1);
      setStep(0);
      setDraft({ ingredients: [] });
      setPhase({ kind: "building", startedAt: Date.now() });
      return;
    }
    const run = { score: totalPoints, total: maxPoints, durationMs: banked };
    record({ kind: "speed-round", ...run });
    setPhase({ kind: "finished", newBest: isBetterRun(run, best) });
  }

  const back = (
    <Button variant="ghost" asChild>
      <Link to="/practice" className="-ml-1 self-start">
        <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
        Practice
      </Link>
    </Button>
  );

  if (phase.kind === "ready") {
    return (
      <div className="flex flex-col gap-3">
        {back}
        <header className="flex max-w-80 flex-col gap-1">
          <Eyebrow tone="accent">Speed Round</Eyebrow>
          <Display size="lg">Five tickets. Build them from memory.</Display>
          <Text size="lg" tone="muted">
            For each drink, pick every ingredient in the spec, then the glass, ice, method and
            garnish. You score up to {POINTS_PER_TICKET} points a ticket, and the clock runs while
            you build.
          </Text>
        </header>
        <Text tone="subtle" size="sm">
          {learned.status === "ready" && learned.data.length >= 5
            ? "Tickets come from the drinks you're learning."
            : "Tickets come from the drinks taught in the courses. Once you've learned five, they'll come from yours."}
        </Text>
        {best && (
          <Card padding="sm" className="flex items-center gap-1.5 self-start">
            <Trophy aria-hidden size={20} strokeWidth={ICON_STROKE} className="text-brass" />
            <Text size="sm">
              Personal best: {best.score}/{best.total} in {formatDuration(best.durationMs)}
            </Text>
          </Card>
        )}
        <Button
          size="lg"
          className="self-start"
          onClick={start}
          disabled={learned.status === "loading"}
        >
          <Timer aria-hidden size={18} strokeWidth={ICON_STROKE} />
          Start the round
        </Button>
      </div>
    );
  }

  if (phase.kind === "finished") {
    return (
      <div className="flex flex-col gap-3">
        {back}
        <header className="flex flex-col gap-1">
          <Eyebrow tone="accent">Round complete</Eyebrow>
          <Display size="lg">
            {totalPoints} of {maxPoints}
          </Display>
          <Text size="lg" tone="muted">
            {Math.round((totalPoints / maxPoints) * 100)}% accurate in {formatDuration(banked)}.
          </Text>
          {phase.newBest && (
            <div>
              <Badge tone="brass" icon={<Trophy aria-hidden size={14} strokeWidth={ICON_STROKE} />}>
                New personal best
              </Badge>
            </div>
          )}
        </header>
        <ul
          aria-label="Tickets"
          className="flex flex-col divide-y divide-line border-y border-line"
        >
          {tickets.map((t, i) => (
            <li key={t.cocktailId} className="flex items-center justify-between gap-2 py-1">
              <Link
                to={`/library/${t.cocktailId}`}
                className="text-base text-ink underline-offset-[3px] hover:underline"
              >
                {t.name}
              </Link>
              <span className="text-sm text-ink-muted tabular">
                {results[i]?.score.points ?? 0}/{POINTS_PER_TICKET}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1">
          <Button onClick={start}>Play again</Button>
          <Button variant="secondary" asChild>
            <Link to="/practice">Back to Practice</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!ticket) return null;
  const result = results[index];
  const field = CHOICE_FIELDS[step - 1];

  return (
    <div className="flex flex-col gap-3">
      {back}
      <ProgressBar
        label={`Ticket ${String(index + 1)} of ${String(tickets.length)}`}
        value={index}
        max={tickets.length}
      />
      <TicketCard
        label={`Ticket ${String(index + 1)} of ${String(tickets.length)}`}
        meta={
          phase.kind === "building" ? (
            <Clock startedAt={phase.startedAt} banked={banked} />
          ) : (
            formatDuration(banked)
          )
        }
        title={ticket.name}
      />

      {phase.kind === "checked" && result ? (
        <div className="flex flex-col gap-2">
          <Heading as="h2" size="md">
            {result.score.points === POINTS_PER_TICKET
              ? "Perfect build"
              : `${String(result.score.points)} of ${String(POINTS_PER_TICKET)} points`}
          </Heading>
          <TicketResult ticket={ticket} answer={result.answer} score={result.score} />
          <Button className="self-start" onClick={nextTicket}>
            {index + 1 < tickets.length ? "Next ticket" : "See your score"}
            <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
          </Button>
        </div>
      ) : step === 0 ? (
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
      ) : field ? (
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
      ) : null}
    </div>
  );
}
