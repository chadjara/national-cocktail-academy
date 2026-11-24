import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  listCourses,
  nextLessonInCourse,
  type Course,
  type Lesson,
  type Question,
} from "~/content/curriculum";
import {
  Badge,
  Button,
  ChoiceQuestion,
  Display,
  Eyebrow,
  Heading,
  ICON_STROKE,
  ProgressBar,
  Text,
  type ChoiceResult,
} from "~/design-system";
import { getScenario, type Scenario } from "~/content/scenarios";
import { useUnits } from "~/features/library/hooks/use-units";
import { tapFeedback } from "~/lib/native";

import { useLessonActions, useProgress } from "../hooks/use-progress";
import { drillQuestions, presentQuestion } from "../services/drill";
import { isLessonComplete } from "../services/progress";
import { LessonBlock } from "./lesson-blocks";
import { ScenarioPlayer } from "./scenario-player";

type Section =
  | { kind: "content"; key: string; block: Parameters<typeof LessonBlock>[0]["block"] }
  | { kind: "questions"; key: string; questions: (Question & { key: string })[] }
  | { kind: "scenario"; key: string; scenario: Scenario };

/** Splits a lesson into teaching blocks and question groups, with stable keys and seeds. */
function useSections(course: Course, lesson: Lesson): Section[] {
  const { units } = useUnits();
  return useMemo(
    () =>
      lesson.blocks.map((block, index): Section => {
        const seed = `${course.id}/${lesson.id}/${String(index)}`;
        if (block.kind === "question") {
          return {
            kind: "questions",
            key: seed,
            questions: [{ ...presentQuestion(block.question, seed), key: seed }],
          };
        }
        if (block.kind === "drill") {
          return {
            kind: "questions",
            // Units change the wording of amounts, so a unit switch starts the drill fresh.
            key: `${seed}/${units}`,
            questions: drillQuestions(block, units, seed).map((question) => ({
              ...question,
              key: `${seed}/${units}/${question.id}`,
            })),
          };
        }
        if (block.kind === "scenario") {
          const scenario = getScenario(block.scenarioId);
          if (scenario) return { kind: "scenario", key: `${seed}/scenario`, scenario };
          throw new Error(`Unknown scenario: ${block.scenarioId}`);
        }
        return { kind: "content", key: seed, block };
      }),
    [course.id, lesson, units],
  );
}

function NextStep({ course, lesson }: { course: Course; lesson: Lesson }) {
  const next = nextLessonInCourse(course.id, lesson.id);
  const courses = listCourses();
  const nextCourse = courses[courses.findIndex((c) => c.id === course.id) + 1];

  if (next) {
    return (
      <Button asChild>
        <Link to={`/learn/${course.id}/${next.id}`}>
          Next: {next.title}
          <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
        </Link>
      </Button>
    );
  }
  return (
    <div className="flex flex-wrap gap-1">
      <Button asChild variant={nextCourse ? "secondary" : "primary"}>
        <Link to={`/learn/${course.id}`}>Back to {course.title}</Link>
      </Button>
      {nextCourse && (
        <Button asChild>
          <Link to={`/learn/${nextCourse.id}`}>
            Next course: {nextCourse.title}
            <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
          </Link>
        </Button>
      )}
    </div>
  );
}

/**
 * Plays one lesson top to bottom: teaching blocks, then questions and
 * scenarios in place. The lesson is finished, and saved on the device, once
 * every question has been answered correctly and every scenario finished
 * without an unsafe choice. Both can be retried as often as needed.
 */
export function LessonPlayer({ course, lesson }: { course: Course; lesson: Lesson }) {
  const sections = useSections(course, lesson);
  // Numbered across the whole lesson: "Question 3 of 7".
  const questionKeys = useMemo(
    () =>
      sections.flatMap((section) =>
        section.kind === "questions" ? section.questions.map((q) => q.key) : [],
      ),
    [sections],
  );
  const scenarioKeys = useMemo(
    () => sections.flatMap((section) => (section.kind === "scenario" ? [section.key] : [])),
    [sections],
  );
  const taskKeys = useMemo(() => [...questionKeys, ...scenarioKeys], [questionKeys, scenarioKeys]);
  const [solved, setSolved] = useState<ReadonlySet<string>>(new Set());
  const progress = useProgress();
  const { complete } = useLessonActions();

  const solvedCount = taskKeys.filter((key) => solved.has(key)).length;
  const finished = taskKeys.length > 0 && solvedCount === taskKeys.length;
  const finishedBefore =
    progress.status === "ready" && isLessonComplete(progress.data, course.id, lesson.id);
  const lessonIndex = course.lessons.findIndex((l) => l.id === lesson.id);

  useEffect(() => {
    if (finished) complete(course.id, lesson.id);
  }, [finished, complete, course.id, lesson.id]);

  const onScenarioFinish = useCallback((key: string, passed: boolean) => {
    if (!passed) return;
    setSolved((current) => new Set([...current, key]));
  }, []);

  const onAnswer = useCallback((key: string, result: ChoiceResult) => {
    if (result !== "correct") return;
    tapFeedback();
    setSolved((current) => new Set([...current, key]));
  }, []);

  return (
    <article className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <Button variant="ghost" asChild>
          <Link to={`/learn/${course.id}`} className="-ml-1 self-start">
            <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
            {course.title}
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <Eyebrow tone="accent">
            Lesson {lessonIndex + 1} of {course.lessons.length}
          </Eyebrow>
          <Display size="lg">{lesson.title}</Display>
          <Text size="lg" tone="muted">
            {lesson.summary}
          </Text>
          {finishedBefore && (
            <div>
              <Badge
                tone="success"
                icon={<CircleCheck aria-hidden size={14} strokeWidth={ICON_STROKE} />}
              >
                Completed
              </Badge>
            </div>
          )}
        </div>
      </header>

      <div className="flex max-w-80 flex-col gap-3">
        {sections.map((section) => {
          if (section.kind === "content")
            return <LessonBlock key={section.key} block={section.block} />;
          if (section.kind === "scenario")
            return (
              <ScenarioPlayer
                key={section.key}
                scenario={section.scenario}
                onFinish={(passed) => onScenarioFinish(section.key, passed)}
              />
            );
          return (
            <section
              key={section.key}
              aria-label="Check your understanding"
              className="flex flex-col gap-1.5"
            >
              {section.questions.map((question) => {
                const questionNumber = questionKeys.indexOf(question.key) + 1;
                return (
                  <ChoiceQuestion
                    key={question.key}
                    number={`Question ${String(questionNumber)} of ${String(questionKeys.length)}`}
                    prompt={question.prompt}
                    options={question.options}
                    answer={question.answer}
                    explanation={question.explanation}
                    onAnswer={(result) => onAnswer(question.key, result)}
                  />
                );
              })}
            </section>
          );
        })}

        <section
          aria-labelledby="lesson-status"
          className="flex flex-col gap-1.5 border-t border-line pt-3"
        >
          <Heading as="h2" size="sm" id="lesson-status" className={finished ? "text-success" : ""}>
            {finished
              ? "Lesson complete"
              : scenarioKeys.length === 0
                ? "Answer every question to finish"
                : questionKeys.length === 0
                  ? "Finish every scenario safely to complete the lesson"
                  : "Answer every question and finish every scenario safely"}
          </Heading>
          <ProgressBar
            label={
              scenarioKeys.length === 0
                ? `${String(solvedCount)} of ${String(taskKeys.length)} correct`
                : `${String(solvedCount)} of ${String(taskKeys.length)} done`
            }
            value={solvedCount}
            max={taskKeys.length}
            tone={finished ? "success" : "accent"}
          />
          {finished && <NextStep course={course} lesson={lesson} />}
        </section>
      </div>
    </article>
  );
}
