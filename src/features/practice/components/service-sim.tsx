import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageSquareQuote,
  Timer,
  Trophy,
  TriangleAlert,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import type { GuestMoment } from "~/content/service-sim";
import {
  Badge,
  Button,
  Card,
  Display,
  Eyebrow,
  Heading,
  ICON_STROKE,
  ProgressBar,
  Text,
  TicketCard,
} from "~/design-system";
import { ChoiceWithFeedback } from "~/features/learn/components/choice-with-feedback";
import { useUnits } from "~/features/library/hooks/use-units";
import { useLiveQuery } from "~/lib/db/use-live-query";
import { tapFeedback } from "~/lib/native";

import { useCapstoneStatus, useSaveCapstone } from "../hooks/use-capstone";
import { reviewRepository } from "../repositories/review-repository";
import {
  makeShift,
  PASS_PERCENT,
  POINTS_PER_MOMENT,
  scoreShift,
  SHIFT_MOMENTS,
  SHIFT_TICKETS,
  type EventResult,
  type ShiftScore,
} from "../services/service-sim";
import {
  formatDuration,
  POINTS_PER_TICKET,
  scoreTicket,
  type TicketAnswer,
  type TicketScore,
} from "../services/speed-round";
import { Clock, TicketBuilder, TicketResult } from "./ticket-builder";

type Phase =
  | { kind: "ready" }
  | { kind: "working"; startedAt: number }
  | { kind: "feedback" }
  | { kind: "finished"; score: ShiftScore };

type Outcome =
  | { kind: "ticket"; answer: TicketAnswer; score: TicketScore }
  | { kind: "moment"; choice: GuestMoment["choices"][number] };

/**
 * The capstone: a simulated shift of eight tickets with four guest moments
 * between them. The clock runs and your time is kept, but you pass on accuracy
 * (80%+) with no unsafe call.
 */
export function ServiceSim() {
  const { units } = useUnits();
  const learned = useLiveQuery(async () => [...(await reviewRepository.enrolledCocktailIds())], []);
  const status = useCapstoneStatus();
  const save = useSaveCapstone();

  const [seed, setSeed] = useState<string | null>(null);
  const events = useMemo(
    () =>
      seed === null ? [] : makeShift(learned.status === "ready" ? learned.data : [], units, seed),
    // A shift is dealt once per seed; changing units mid-shift must not redeal it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );
  const [phase, setPhase] = useState<Phase>({ kind: "ready" });
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [banked, setBanked] = useState(0);
  const event = events[index];

  function start() {
    tapFeedback();
    setSeed(String(Date.now()));
    setIndex(0);
    setOutcomes([]);
    setBanked(0);
    setPhase({ kind: "working", startedAt: Date.now() });
  }

  function record(outcome: Outcome) {
    if (phase.kind !== "working") return;
    setBanked((ms) => ms + Date.now() - phase.startedAt);
    setOutcomes((list) => [...list, outcome]);
    setPhase({ kind: "feedback" });
  }

  function next() {
    if (index + 1 < events.length) {
      setIndex(index + 1);
      setPhase({ kind: "working", startedAt: Date.now() });
      return;
    }
    const results: EventResult[] = outcomes.map((o) =>
      o.kind === "ticket"
        ? { kind: "ticket", points: o.score.points }
        : { kind: "moment", outcome: o.choice.outcome },
    );
    const score = scoreShift(events, results);
    void save({ ...score, durationMs: Math.round(banked), finishedAt: new Date().toISOString() });
    setPhase({ kind: "finished", score });
  }

  const back = (
    <Button variant="ghost" asChild>
      <Link to="/learn" className="-ml-1 self-start">
        <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
        Learn
      </Link>
    </Button>
  );

  if (phase.kind === "ready") {
    const best = status.status === "ready" ? status.data.best : undefined;
    return (
      <div className="flex flex-col gap-3">
        {back}
        <header className="flex max-w-80 flex-col gap-1">
          <Eyebrow tone="accent">Capstone</Eyebrow>
          <Display size="lg">The Service Sim</Display>
          <Text size="lg" tone="muted">
            A shift behind the bar: {SHIFT_TICKETS} drink tickets to build from memory, with{" "}
            {SHIFT_MOMENTS} guest situations landing between them. Pass with {PASS_PERCENT}% or
            better and no unsafe calls. The clock runs and your time is kept as a personal best, but
            you pass on accuracy, not speed.
          </Text>
        </header>
        {status.status === "ready" && status.data.attempts > 0 && best && (
          <Card padding="sm" className="flex items-center gap-1.5 self-start">
            <Trophy
              aria-hidden
              size={20}
              strokeWidth={ICON_STROKE}
              className={status.data.passed ? "text-brass" : "text-ink-subtle"}
            />
            <Text size="sm">
              {status.data.passed ? "Passed" : "Not passed yet"} · best{" "}
              {Math.round((best.score / best.total) * 100)}% in {formatDuration(best.durationMs)}
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
          Start the shift
        </Button>
      </div>
    );
  }

  if (phase.kind === "finished") {
    const { score } = phase;
    return (
      <div className="flex flex-col gap-3">
        {back}
        <header className="flex flex-col gap-1" aria-live="polite">
          <Eyebrow tone="accent">Shift over</Eyebrow>
          <Display size="lg">{score.percent}%</Display>
          <Text size="lg" tone="muted">
            {score.score} of {score.total} points in {formatDuration(banked)}.
          </Text>
          <div>
            {score.passed ? (
              <Badge tone="brass" icon={<Trophy aria-hidden size={14} strokeWidth={ICON_STROKE} />}>
                Service Sim passed
              </Badge>
            ) : (
              <Badge tone="warning">Not passed yet</Badge>
            )}
          </div>
          {!score.passed && (
            <Text tone="muted" className="flex items-start gap-1 pt-1">
              <TriangleAlert
                aria-hidden
                size={18}
                strokeWidth={ICON_STROKE}
                className="mt-0.5 shrink-0 text-warning"
              />
              {score.unsafe
                ? "You made an unsafe call with a guest. A shift with an unsafe call doesn't pass, whatever the score."
                : `The pass mark is ${String(PASS_PERCENT)}%. Brush up on the specs you missed, then run another shift.`}
            </Text>
          )}
        </header>
        <ol
          aria-label="Your shift"
          className="flex flex-col divide-y divide-line border-y border-line"
        >
          {events.map((e, i) => {
            const outcome = outcomes[i];
            const right =
              outcome?.kind === "ticket"
                ? outcome.score.points === POINTS_PER_TICKET
                : outcome?.kind === "moment" && outcome.choice.outcome === "best";
            return (
              <li key={i} className="flex items-center gap-1.5 py-1 text-sm">
                {right ? (
                  <Check
                    aria-hidden
                    size={18}
                    strokeWidth={ICON_STROKE}
                    className="shrink-0 text-success"
                  />
                ) : (
                  <X
                    aria-hidden
                    size={18}
                    strokeWidth={ICON_STROKE}
                    className="shrink-0 text-danger"
                  />
                )}
                <span className="flex-1 text-ink">
                  {e.kind === "ticket" ? e.ticket.name : "Guest moment"}
                </span>
                <span className="text-ink-muted tabular">
                  {outcome?.kind === "ticket"
                    ? `${String(outcome.score.points)}/${String(POINTS_PER_TICKET)}`
                    : outcome?.kind === "moment"
                      ? outcome.choice.outcome === "unsafe"
                        ? "Unsafe"
                        : `${String(outcome.choice.outcome === "best" ? 2 : 1)}/${String(POINTS_PER_MOMENT)}`
                      : ""}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-wrap gap-1">
          {score.passed && (
            <Button asChild>
              <Link to="/certificate">See your certificate</Link>
            </Button>
          )}
          <Button variant={score.passed ? "secondary" : "primary"} onClick={start}>
            Start a new shift
          </Button>
        </div>
      </div>
    );
  }

  if (!event) return null;
  const outcome = outcomes[index];
  const label = `Shift · ${String(index + 1)} of ${String(events.length)}`;
  const meta =
    phase.kind === "working" ? (
      <Clock startedAt={phase.startedAt} banked={banked} />
    ) : (
      formatDuration(banked)
    );

  return (
    <div className="flex flex-col gap-3">
      {back}
      <ProgressBar label={label} value={index} max={events.length} />
      {event.kind === "ticket" ? (
        <>
          <TicketCard label={label} meta={meta} title={event.ticket.name} />
          {phase.kind === "feedback" && outcome?.kind === "ticket" ? (
            <div className="flex flex-col gap-2">
              <Heading as="h2" size="md">
                {outcome.score.points === POINTS_PER_TICKET
                  ? "Perfect build"
                  : `${String(outcome.score.points)} of ${String(POINTS_PER_TICKET)} points`}
              </Heading>
              <TicketResult ticket={event.ticket} answer={outcome.answer} score={outcome.score} />
            </div>
          ) : (
            <TicketBuilder
              key={`${event.ticket.cocktailId}-${String(index)}`}
              ticket={event.ticket}
              onSubmit={(answer) =>
                record({ kind: "ticket", answer, score: scoreTicket(event.ticket, answer) })
              }
            />
          )}
        </>
      ) : (
        <Card as="section" aria-labelledby="moment-heading" className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <Eyebrow tone="accent">Guest moment</Eyebrow>
            <span className="text-caption text-ink-subtle tabular">{meta}</span>
          </div>
          <Heading as="h2" size="sm" id="moment-heading" className="sr-only">
            Guest moment
          </Heading>
          <blockquote className="flex gap-1.5 rounded-base bg-sunken p-1.5 text-base text-ink">
            <MessageSquareQuote
              aria-hidden
              size={20}
              strokeWidth={ICON_STROKE}
              className="mt-0.5 shrink-0 text-ink-subtle"
            />
            <span>{event.moment.situation}</span>
          </blockquote>
          <p id="moment-question" className="text-sm font-semibold text-ink">
            What do you do?
          </p>
          <ChoiceWithFeedback
            key={`${event.moment.id}-${String(index)}`}
            labelledBy="moment-question"
            choices={event.moment.choices}
            picked={outcome?.kind === "moment" ? outcome.choice : null}
            onPick={(choice) => {
              tapFeedback();
              record({ kind: "moment", choice });
            }}
          />
        </Card>
      )}
      {phase.kind === "feedback" && (
        <Button className="self-start" onClick={next}>
          {index + 1 < events.length ? "Next" : "End the shift"}
          <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
        </Button>
      )}
    </div>
  );
}
