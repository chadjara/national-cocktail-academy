import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import {
  Badge,
  Button,
  Card,
  Display,
  Eyebrow,
  Field,
  Heading,
  ICON_STROKE,
  Input,
  ProgressBar,
  StepList,
  Text,
} from "~/design-system";
import { tapFeedback } from "~/lib/native";

import { useRecordRun } from "../hooks/use-runs";
import {
  formatAnswer,
  isCorrect,
  makeProblemSet,
  parseAnswer,
  type MathProblem,
} from "../services/bar-math";

const unitHint: Record<MathProblem["unit"], string> = {
  $: "In dollars, like 1.42",
  "%": "As a percentage, like 17.5",
  oz: "In ounces, like 12",
  bottles: "A whole number of bottles",
};

/** Bar Math: five problems on different topics, each with a worked solution once answered. */
export function BarMath() {
  const record = useRecordRun();
  const [problems, setProblems] = useState(() => makeProblemSet(String(Date.now())));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const problem = problems[index];
  const answered = results.length > index;
  const correct = results.filter(Boolean).length;

  function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!problem || answered) return;
    const value = parseAnswer(input);
    if (value === undefined) {
      setError("Enter a number.");
      return;
    }
    setError(null);
    tapFeedback();
    const next = [...results, isCorrect(problem, value)];
    setResults(next);
    if (next.length === problems.length) {
      record({
        kind: "bar-math",
        score: next.filter(Boolean).length,
        total: problems.length,
        durationMs: Date.now() - startedAt,
      });
    }
  }

  function restart() {
    setProblems(makeProblemSet(String(Date.now())));
    setIndex(0);
    setInput("");
    setResults([]);
    setStartedAt(Date.now());
  }

  const back = (
    <Button variant="ghost" asChild>
      <Link to="/practice" className="-ml-1 self-start">
        <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
        Practice
      </Link>
    </Button>
  );

  if (!problem) {
    return (
      <div className="flex flex-col gap-3">
        {back}
        <header className="flex flex-col gap-1">
          <Eyebrow tone="accent">Bar Math</Eyebrow>
          <Display size="lg">
            {correct} of {problems.length}
          </Display>
          <Text size="lg" tone="muted">
            {correct === problems.length
              ? "Every one right. You can price a menu and order the bar."
              : "Work through the solutions above for any you missed, then try a new set."}
          </Text>
        </header>
        <ul aria-label="Topics" className="flex flex-col divide-y divide-line border-y border-line">
          {problems.map((p, i) => (
            <li key={p.id} className="flex items-center justify-between gap-2 py-1 text-sm">
              <span className="text-ink">{p.topic}</span>
              {results[i] ? (
                <Badge tone="success">Right</Badge>
              ) : (
                <Badge tone="danger">Missed: {formatAnswer(p)}</Badge>
              )}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1">
          <Button onClick={restart}>New set</Button>
          <Button variant="secondary" asChild>
            <Link to="/practice">Back to Practice</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {back}
      <header className="flex max-w-80 flex-col gap-1">
        <Eyebrow tone="accent">Bar Math</Eyebrow>
        <Display size="md">Run the numbers</Display>
      </header>
      <ProgressBar
        label={`Problem ${String(index + 1)} of ${String(problems.length)}`}
        value={index}
        max={problems.length}
      />
      <Card as="section" aria-labelledby="problem" padding="lg" className="flex flex-col gap-2">
        <Eyebrow tone="accent">{problem.topic}</Eyebrow>
        <Heading as="h2" size="md" id="problem">
          {problem.prompt}
        </Heading>
        <form onSubmit={submit} className="flex flex-col gap-1.5" noValidate>
          <Field label="Your answer" hint={unitHint[problem.unit]} error={error ?? undefined}>
            <Input
              value={input}
              inputMode="decimal"
              autoComplete="off"
              readOnly={answered}
              onChange={(event) => setInput(event.target.value)}
            />
          </Field>
          {!answered && (
            <Button type="submit" className="self-start">
              Check
            </Button>
          )}
        </form>
        <div aria-live="polite">
          {answered && (
            <div className="flex flex-col gap-1.5 border-t border-line pt-1.5">
              <p className="flex items-center gap-1 text-base font-semibold">
                {results[index] ? (
                  <>
                    <Check
                      aria-hidden
                      size={20}
                      strokeWidth={ICON_STROKE}
                      className="text-success"
                    />
                    <span className="text-success">Right: {formatAnswer(problem)}</span>
                  </>
                ) : (
                  <>
                    <X aria-hidden size={20} strokeWidth={ICON_STROKE} className="text-danger" />
                    <span className="text-danger">The answer is {formatAnswer(problem)}</span>
                  </>
                )}
              </p>
              <StepList title="How to work it out" items={problem.solution} />
              <Button
                className="self-start"
                onClick={() => {
                  setIndex(index + 1);
                  setInput("");
                }}
              >
                {index + 1 < problems.length ? "Next problem" : "See your score"}
                <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
