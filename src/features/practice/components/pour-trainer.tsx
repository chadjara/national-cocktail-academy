import { ArrowLeft, Droplets, Hand } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router";

import {
  Button,
  Callout,
  Card,
  Display,
  Eyebrow,
  Heading,
  ICON_STROKE,
  ProgressBar,
  StepList,
  Tabs,
  Text,
  cn,
} from "~/design-system";
import { useUnits } from "~/features/library/hooks/use-units";
import { seededRandom } from "~/lib/rng";
import { tapFeedback } from "~/lib/native";

import { useRecordRun, useRuns } from "../hooks/use-runs";
import {
  calibrate,
  countsFor,
  describeError,
  formatPour,
  heldToOz,
  POUR_TARGETS_OZ,
  pourTargets,
  readingOptions,
  scorePour,
} from "../services/pour";

const CALIBRATION_HOLDS = 3;

/** A large press-and-hold control that reports how long it was held, by touch, mouse or keyboard. */
function HoldButton({ label, onHold }: { label: string; onHold: (ms: number) => void }) {
  const startedAt = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);

  function begin() {
    if (startedAt.current !== null) return;
    startedAt.current = performance.now();
    setHolding(true);
  }
  function end() {
    if (startedAt.current === null) return;
    const ms = performance.now() - startedAt.current;
    startedAt.current = null;
    setHolding(false);
    tapFeedback();
    onHold(ms);
  }
  const isHoldKey = (event: KeyboardEvent) => event.key === " " || event.key === "Enter";

  return (
    <button
      type="button"
      aria-pressed={holding}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        begin();
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={(event) => {
        if (!isHoldKey(event)) return;
        event.preventDefault();
        if (!event.repeat) begin();
      }}
      onKeyUp={(event) => {
        if (isHoldKey(event)) end();
      }}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        "flex h-22 w-full touch-none flex-col items-center justify-center gap-1 rounded-base border-2 text-heading-md font-semibold select-none",
        "transition-colors duration-(--duration-fast) ease-(--ease-out)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        holding
          ? "border-accent bg-accent text-on-accent"
          : "border-accent bg-accent-subtle text-accent-text",
      )}
    >
      <Hand aria-hidden size={28} strokeWidth={ICON_STROKE} />
      {holding ? "Pouring…" : label}
    </button>
  );
}

function TimingDrill() {
  const { units } = useUnits();
  const record = useRecordRun();
  const [holds, setHolds] = useState<number[]>([]);
  const [targets, setTargets] = useState(() => pourTargets(seededRandom(String(Date.now()))));
  const [pours, setPours] = useState<number[]>([]);
  const msPerOz = holds.length >= CALIBRATION_HOLDS ? calibrate(holds) : 0;
  const index = pours.length;
  const target = targets[index];
  const lastPoured = pours.at(-1);
  const lastTarget = targets[index - 1];
  const finished = index >= targets.length;
  const score = pours.reduce((sum, poured, i) => sum + scorePour(targets[i] ?? 0, poured), 0);

  if (msPerOz === 0) {
    return (
      <div className="flex flex-col gap-2">
        <Heading as="h3" size="md">
          First, set your count ({holds.length} of {CALIBRATION_HOLDS})
        </Heading>
        <Text tone="muted">
          Hold the button while you count a steady four, the count you'd use to pour 1 oz, and let
          go on four. Do it three times. Everything after is measured against your own rhythm.
        </Text>
        <HoldButton label="Hold for a 4-count" onHold={(ms) => setHolds((list) => [...list, ms])} />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col gap-2" aria-live="polite">
        <Heading as="h3" size="md">
          {score} of {targets.length * 2} points
        </Heading>
        <ul
          aria-label="Your pours"
          className="flex flex-col divide-y divide-line border-y border-line"
        >
          {pours.map((poured, i) => (
            <li key={i} className="flex justify-between gap-2 py-1 text-sm">
              <span className="text-ink">Target {formatPour(targets[i] ?? 0, units)}</span>
              <span className="text-ink-muted">
                {describeError(targets[i] ?? 0, Math.round(poured * 8) / 8, units)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1">
          <Button
            onClick={() => {
              setPours([]);
              setTargets(pourTargets(seededRandom(String(Date.now()))));
            }}
          >
            Pour another round
          </Button>
          <Button variant="secondary" onClick={() => setHolds([])}>
            Reset my count
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <ProgressBar
        label={`Pour ${String(index + 1)} of ${String(targets.length)}`}
        value={index}
        max={targets.length}
      />
      {target !== undefined && (
        <Card padding="sm" className="flex flex-col gap-0.5">
          <Eyebrow tone="accent">Pour</Eyebrow>
          <p className="font-display-optical text-display-sm text-ink">
            {formatPour(target, units)}
          </p>
          <Text size="sm" tone="muted">
            That's a {countsFor(target)}-count.
          </Text>
        </Card>
      )}
      <HoldButton
        label="Hold to pour"
        onHold={(ms) => {
          const next = [...pours, heldToOz(ms, msPerOz)];
          setPours(next);
          if (next.length === targets.length) {
            const total = next.reduce(
              (sum, poured, i) => sum + scorePour(targets[i] ?? 0, poured),
              0,
            );
            record({ kind: "pour-timing", score: total, total: targets.length * 2, durationMs: 0 });
          }
        }}
      />
      <p aria-live="polite" className="min-h-3 text-base text-ink">
        {lastPoured !== undefined && lastTarget !== undefined && (
          <>
            Last pour: about {formatPour(Math.round(lastPoured * 8) / 8, units)} for a{" "}
            {formatPour(lastTarget, units)} target.{" "}
            <span className="font-semibold">
              {describeError(lastTarget, Math.round(lastPoured * 8) / 8, units)}.
            </span>
          </>
        )}
      </p>
    </div>
  );
}

function WaterLog() {
  const { units } = useUnits();
  const record = useRecordRun();
  const stats = useRuns("pour-log");
  const [target, setTarget] = useState(1.5);
  const [logged, setLogged] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <StepList
        title="At home, with water"
        items={[
          "Fit a speed pourer to an empty bottle and fill it with water.",
          "Pick a target below and pour it into a jigger by count, without watching the jigger.",
          "Read the jigger and log what you actually poured.",
        ]}
      />
      <div className="flex flex-col gap-1">
        <Heading as="h3" size="sm" id="target-heading">
          Target
        </Heading>
        <div role="radiogroup" aria-labelledby="target-heading" className="flex flex-wrap gap-1">
          {POUR_TARGETS_OZ.map((oz) => (
            <Button
              key={oz}
              role="radio"
              aria-checked={target === oz}
              variant={target === oz ? "primary" : "secondary"}
              onClick={() => {
                setTarget(oz);
                setLogged(null);
              }}
            >
              {formatPour(oz, units)} · {countsFor(oz)}-count
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Heading as="h3" size="sm" id="reading-heading">
          What did the jigger read?
        </Heading>
        <div
          aria-labelledby="reading-heading"
          role="group"
          className="grid grid-cols-2 gap-1 sm:grid-cols-4"
        >
          {readingOptions(target).map((oz) => (
            <Button
              key={oz}
              variant={logged === oz ? "primary" : "secondary"}
              onClick={() => {
                setLogged(oz);
                tapFeedback();
                record({ kind: "pour-log", score: scorePour(target, oz), total: 2, durationMs: 0 });
              }}
            >
              {formatPour(oz, units)}
            </Button>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="min-h-3 text-base text-ink">
        {logged !== null && (
          <>
            <span className="font-semibold">{describeError(target, logged, units)}.</span>{" "}
            {scorePour(target, logged) === 2
              ? "That's a pour you can trust."
              : logged > target
                ? "Count a little faster, or tip the bottle back sooner."
                : "Count a little slower, or hold the pour a beat longer."}
          </>
        )}
      </p>
      {stats.status === "ready" &&
        stats.data.count > 0 &&
        stats.data.recentAccuracy !== undefined && (
          <Text size="sm" tone="subtle">
            {stats.data.count} pours logged. Recent accuracy:{" "}
            {Math.round(stats.data.recentAccuracy * 100)}%.
          </Text>
        )}
    </div>
  );
}

export function PourTrainer() {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="ghost" asChild>
        <Link to="/practice" className="-ml-1 self-start">
          <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
          Practice
        </Link>
      </Button>
      <header className="flex max-w-80 flex-col gap-1">
        <Eyebrow tone="accent">Pour Trainer</Eyebrow>
        <Display size="lg">Find your count</Display>
        <Text size="lg" tone="muted">
          Free pouring means pouring by count instead of a jigger. With a standard speed pourer,
          most bars teach a steady four-count as 1 oz: one count for every ¼ oz.
        </Text>
      </header>
      <Callout tone="tip" title="Calibrate with a jigger">
        Pourers and bottles vary, so a count is only as good as its last check. Check yours against
        a jigger every shift. Many bars require jiggers for every pour anyway.
      </Callout>
      <Tabs
        label="Pour Trainer mode"
        items={[
          { value: "timing", label: "Count rhythm", content: <TimingDrill /> },
          {
            value: "water",
            label: "Water pour log",
            content: <WaterLog />,
          },
        ]}
      />
      <Text size="sm" tone="subtle" className="flex items-center gap-0.5">
        <Droplets aria-hidden size={16} strokeWidth={ICON_STROKE} />
        Practice with water. Never practice pours with alcohol.
      </Text>
    </div>
  );
}
