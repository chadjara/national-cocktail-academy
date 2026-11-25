import { ArrowLeft, ArrowRight, Timer, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

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
import { useUnits } from "~/features/library/hooks/use-units";
import { useLiveQuery } from "~/lib/db/use-live-query";
import { tapFeedback } from "~/lib/native";

import { useRecordRun, useRuns } from "../hooks/use-runs";
import { reviewRepository } from "../repositories/review-repository";
import {
  formatDuration,
  isBetterRun,
  makeRound,
  POINTS_PER_TICKET,
  scoreTicket,
  type TicketAnswer,
  type TicketScore,
} from "../services/speed-round";
import { Clock, TicketBuilder, TicketResult } from "./ticket-builder";

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
    setResults([]);
    setBanked(0);
    setPhase({ kind: "building", startedAt: Date.now() });
  }

  function check(answer: TicketAnswer) {
    if (!ticket || phase.kind !== "building") return;
    setBanked((ms) => ms + Date.now() - phase.startedAt);
    setResults((list) => [...list, { answer, score: scoreTicket(ticket, answer) }]);
    setPhase({ kind: "checked" });
  }

  function nextTicket() {
    if (index + 1 < tickets.length) {
      setIndex(index + 1);
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
      ) : (
        <TicketBuilder
          key={`${ticket.cocktailId}-${String(index)}`}
          ticket={ticket}
          onSubmit={check}
        />
      )}
    </div>
  );
}
