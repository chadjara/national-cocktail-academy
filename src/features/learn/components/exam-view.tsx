import { ArrowLeft, ArrowRight, Check, Lock, RotateCcw, Trophy, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { appConfig } from "~/config/app.config";
import type { Course } from "~/content/curriculum";
import {
  Badge,
  Button,
  Card,
  Dialog,
  Display,
  Eyebrow,
  Heading,
  ICON_STROKE,
  ProgressBar,
  RadioGroup,
  Skeleton,
  Text,
} from "~/design-system";
import { useUnits } from "~/features/library/hooks/use-units";
import { tapFeedback } from "~/lib/native";

import { useExamStatuses, useSaveExam } from "../hooks/use-exams";
import { useProgress } from "../hooks/use-progress";
import {
  buildExam,
  EXAM_SIZE,
  examPool,
  examUnlock,
  gradeExam,
  type ExamQuestion,
  type ExamResult,
} from "../services/exam";

type Exam = { seed: string; startedAt: string; questions: ExamQuestion[] };

function lessonTitle(course: Course, lessonId: string): string {
  return course.lessons.find((lesson) => lesson.id === lessonId)?.title ?? lessonId;
}

function Results({
  course,
  result,
  onRetake,
}: {
  course: Course;
  result: ExamResult;
  onRetake: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1" aria-live="polite">
        <Eyebrow tone="accent">Exam result</Eyebrow>
        <Display size="lg">{result.percent}%</Display>
        <Text size="lg" tone="muted">
          {result.score} of {result.total} correct.{" "}
          {result.passed
            ? `You passed the ${course.title} exam.`
            : `The pass mark is ${String(appConfig.assessment.passMarkPercent)}%. Review the lessons below, then try a new set of questions.`}
        </Text>
        <div>
          {result.passed ? (
            <Badge tone="brass" icon={<Trophy aria-hidden size={14} strokeWidth={ICON_STROKE} />}>
              Passed
            </Badge>
          ) : (
            <Badge tone="warning">Not passed yet</Badge>
          )}
        </div>
      </header>

      <section aria-labelledby="topics-heading" className="flex flex-col gap-1.5">
        <Heading as="h2" size="lg" id="topics-heading">
          By lesson
        </Heading>
        <ul
          aria-labelledby="topics-heading"
          className="flex flex-col divide-y divide-line border-y border-line"
        >
          {result.topics.map((topic) => {
            const perfect = topic.right === topic.total;
            return (
              <li key={topic.lessonId} className="flex items-center gap-1.5 py-1">
                {perfect ? (
                  <Check
                    aria-hidden
                    size={20}
                    strokeWidth={ICON_STROKE}
                    className="shrink-0 text-success"
                  />
                ) : (
                  <X
                    aria-hidden
                    size={20}
                    strokeWidth={ICON_STROKE}
                    className="shrink-0 text-danger"
                  />
                )}
                <span className="flex-1 text-base text-ink">
                  {perfect ? (
                    lessonTitle(course, topic.lessonId)
                  ) : (
                    <Link
                      to={`/learn/${course.id}/${topic.lessonId}`}
                      className="underline decoration-1 underline-offset-[3px] hover:decoration-2"
                    >
                      Review: {lessonTitle(course, topic.lessonId)}
                    </Link>
                  )}
                </span>
                <span className="text-sm text-ink-muted tabular">
                  {topic.right}/{topic.total}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {result.missed.length > 0 && (
        <section aria-labelledby="missed-heading" className="flex flex-col gap-1.5">
          <Heading as="h2" size="lg" id="missed-heading">
            What you missed
          </Heading>
          <ol aria-labelledby="missed-heading" className="flex flex-col gap-1.5">
            {result.missed.map(({ question, chosen }) => (
              <li key={question.id}>
                <Card padding="sm" className="flex flex-col gap-1">
                  <p className="text-heading-sm font-semibold text-ink">{question.prompt}</p>
                  {chosen !== undefined && (
                    <p className="text-sm text-ink-muted">
                      You answered: <span className="line-through">{question.options[chosen]}</span>
                    </p>
                  )}
                  <p className="text-base text-ink">
                    <span className="font-semibold text-success">Answer: </span>
                    {question.options[question.answer]}
                  </p>
                  <p className="text-sm text-ink-muted">{question.explanation}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="flex flex-wrap gap-1">
        <Button
          onClick={onRetake}
          leadingIcon={<RotateCcw aria-hidden size={18} strokeWidth={ICON_STROKE} />}
        >
          {result.passed ? "Retake for practice" : "Retake with new questions"}
        </Button>
        <Button variant="secondary" asChild>
          <Link to={`/learn/${course.id}`}>Back to {course.title}</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * A course exam: unlocked once every lesson is finished, answered without
 * feedback, then graded with a breakdown by lesson. Every attempt deals a new
 * set of questions, and a retake is available right away.
 */
export function ExamView({ course }: { course: Course }) {
  const { units } = useUnits();
  const progress = useProgress();
  const statuses = useExamStatuses();
  const saveExam = useSaveExam();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [leaving, setLeaving] = useState(false);

  function start() {
    tapFeedback();
    const seed = String(Date.now());
    setExam({
      seed,
      startedAt: new Date().toISOString(),
      questions: buildExam(course, units, seed),
    });
    setIndex(0);
    setAnswers([]);
    setResult(null);
  }

  function submit() {
    if (!exam) return;
    tapFeedback();
    const graded = gradeExam(exam.questions, answers, course);
    setResult(graded);
    void saveExam({
      courseId: course.id,
      seed: exam.seed,
      questionIds: exam.questions.map((q) => q.id),
      score: graded.score,
      total: graded.total,
      passed: graded.passed,
      topics: graded.topics,
      startedAt: exam.startedAt,
      submittedAt: new Date().toISOString(),
    });
  }

  const inProgress = exam !== null && result === null;
  const back = (
    <Button
      variant="ghost"
      className="-ml-1 self-start"
      onClick={() => (inProgress ? setLeaving(true) : void navigate(`/learn/${course.id}`))}
    >
      <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
      {course.title}
    </Button>
  );

  const leaveDialog = (
    <Dialog
      open={leaving}
      onOpenChange={setLeaving}
      title="Leave the exam?"
      description="Your answers so far won't be saved. You can start a new exam any time."
      actions={
        <>
          <Button variant="secondary" onClick={() => setLeaving(false)}>
            Keep going
          </Button>
          <Button variant="danger" onClick={() => void navigate(`/learn/${course.id}`)}>
            Leave
          </Button>
        </>
      }
    >
      {null}
    </Dialog>
  );

  if (result) {
    return (
      <div className="flex flex-col gap-3">
        {back}
        <Results course={course} result={result} onRetake={start} />
      </div>
    );
  }

  if (exam) {
    const question = exam.questions[index];
    const answered = answers[index] !== undefined;
    const last = index === exam.questions.length - 1;
    return (
      <div className="flex flex-col gap-3">
        {back}
        <Eyebrow tone="accent">{course.title} exam</Eyebrow>
        <ProgressBar
          label={`Question ${String(index + 1)} of ${String(exam.questions.length)}`}
          value={index}
          max={exam.questions.length}
        />
        {question && (
          <Card padding="lg" className="flex max-w-80 flex-col gap-2">
            <RadioGroup
              key={question.id}
              labelSize="lg"
              label={question.prompt}
              value={answers[index] === undefined ? "" : String(answers[index])}
              onValueChange={(value) => {
                const next = [...answers];
                next[index] = Number(value);
                setAnswers(next);
              }}
              options={question.options.map((option, i) => ({ value: String(i), label: option }))}
            />
          </Card>
        )}
        <div className="flex flex-wrap gap-1">
          {index > 0 && (
            <Button variant="secondary" onClick={() => setIndex(index - 1)}>
              <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
              Previous
            </Button>
          )}
          {last ? (
            <Button disabled={!answered} onClick={submit}>
              Submit exam
            </Button>
          ) : (
            <Button disabled={!answered} onClick={() => setIndex(index + 1)}>
              Next question
              <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
            </Button>
          )}
        </div>
        {leaveDialog}
      </div>
    );
  }

  if (progress.status !== "ready" || statuses.status === "loading") {
    return (
      <div className="flex flex-col gap-3">
        {back}
        <Skeleton className="h-30" />
      </div>
    );
  }

  const { unlocked, remaining } = examUnlock(course, progress.data);
  const status = statuses.status === "ready" ? statuses.data.get(course.id) : undefined;
  const questionCount = Math.min(EXAM_SIZE, examPool(course, units, "count").length);

  return (
    <div className="flex flex-col gap-3">
      {back}
      <header className="flex max-w-80 flex-col gap-1">
        <Eyebrow tone="accent">Course exam</Eyebrow>
        <Display size="lg">{course.title}</Display>
        <Text size="lg" tone="muted">
          {questionCount} questions from across the course. Pass mark{" "}
          {appConfig.assessment.passMarkPercent}%. You'll see your results and every explanation at
          the end, and each attempt draws new questions.
        </Text>
      </header>
      {unlocked ? (
        <>
          {status?.best && (
            <Card padding="sm" className="flex items-center gap-1.5 self-start">
              <Trophy
                aria-hidden
                size={20}
                strokeWidth={ICON_STROKE}
                className={status.passed ? "text-brass" : "text-ink-subtle"}
              />
              <Text size="sm">
                {status.passed ? "Passed" : "Not passed yet"} · best{" "}
                {Math.round((status.best.score / status.best.total) * 100)}%
              </Text>
            </Card>
          )}
          <Button size="lg" className="self-start" onClick={start}>
            {status ? "Start a new exam" : "Start the exam"}
          </Button>
        </>
      ) : (
        <Card className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <Lock aria-hidden size={20} strokeWidth={ICON_STROKE} className="text-ink-subtle" />
            <Heading as="h2" size="md">
              Finish {remaining.length} more {remaining.length === 1 ? "lesson" : "lessons"} to
              unlock
            </Heading>
          </div>
          <ul className="flex flex-col gap-0.5">
            {remaining.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  to={`/learn/${course.id}/${lesson.id}`}
                  className="text-base text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
