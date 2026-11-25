import { appConfig } from "~/config/app.config";
import type { Course, Lesson, Question } from "~/content/curriculum";
import { seededRandom, shuffle } from "~/lib/rng";

import type { UnitSystem } from "../../library/services/units";
import { drillQuestions, presentQuestion } from "./drill";
import { isLessonComplete, type Progress } from "./progress";

/** Questions per exam. A course with a smaller pool uses all of it. */
export const EXAM_SIZE = 10;

export type ExamQuestion = Question & { id: string; lessonId: string };

/**
 * Every question a course can ask in its exam: the authored questions from
 * each lesson, plus generated questions on every facet of every drink its
 * drills cover. Each is tagged with its lesson for the topic breakdown.
 */
export function examPool(course: Course, units: UnitSystem, seed: string): ExamQuestion[] {
  const pool = new Map<string, ExamQuestion>();
  for (const lesson of course.lessons) {
    lesson.blocks.forEach((block, index) => {
      if (block.kind === "question") {
        const id = `${lesson.id}/${String(index)}`;
        pool.set(id, { ...block.question, id, lessonId: lesson.id });
      }
      if (block.kind === "drill") {
        const generated = drillQuestions(
          { ...block, mode: "every-facet" },
          units,
          `${seed}/${lesson.id}/${String(index)}`,
        );
        for (const question of generated) {
          if (!pool.has(question.id)) pool.set(question.id, { ...question, lessonId: lesson.id });
        }
      }
    });
  }
  return [...pool.values()];
}

/**
 * Deals an exam: questions are drawn lesson by lesson in turn, so every part
 * of the course is covered, then shuffled. A new seed deals a new exam.
 */
export function buildExam(course: Course, units: UnitSystem, seed: string): ExamQuestion[] {
  const random = seededRandom(seed);
  const byLesson = new Map<string, ExamQuestion[]>();
  for (const question of examPool(course, units, seed)) {
    byLesson.set(question.lessonId, [...(byLesson.get(question.lessonId) ?? []), question]);
  }
  const queues = shuffle(
    [...byLesson.values()].map((questions) => shuffle(questions, random)),
    random,
  );
  const picked: ExamQuestion[] = [];
  while (picked.length < EXAM_SIZE && queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && picked.length < EXAM_SIZE) picked.push(next);
    }
  }
  return shuffle(picked, random).map((question) => ({
    ...question,
    ...presentQuestion(question, `${seed}/${question.id}`),
  }));
}

export type TopicResult = { lessonId: string; right: number; total: number };

export type ExamResult = {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  topics: TopicResult[];
  missed: { question: ExamQuestion; chosen: number | undefined }[];
};

/** Grades an exam. Unanswered questions count as wrong. */
export function gradeExam(
  questions: readonly ExamQuestion[],
  answers: readonly (number | undefined)[],
  course: Course,
  passMarkPercent: number = appConfig.assessment.passMarkPercent,
): ExamResult {
  const topics = new Map<string, TopicResult>();
  const missed: ExamResult["missed"] = [];
  let score = 0;
  questions.forEach((question, index) => {
    const right = answers[index] === question.answer;
    if (right) score += 1;
    else missed.push({ question, chosen: answers[index] });
    const topic = topics.get(question.lessonId) ?? {
      lessonId: question.lessonId,
      right: 0,
      total: 0,
    };
    topics.set(question.lessonId, {
      ...topic,
      right: topic.right + (right ? 1 : 0),
      total: topic.total + 1,
    });
  });
  const order = course.lessons.map((lesson) => lesson.id);
  const percent = questions.length === 0 ? 0 : Math.round((score / questions.length) * 100);
  return {
    score,
    total: questions.length,
    percent,
    passed: percent >= passMarkPercent,
    topics: [...topics.values()].sort(
      (a, b) => order.indexOf(a.lessonId) - order.indexOf(b.lessonId),
    ),
    missed,
  };
}

/** A course's exam unlocks once every lesson in it is finished. */
export function examUnlock(
  course: Course,
  progress: Progress,
): { unlocked: boolean; remaining: Lesson[] } {
  const remaining = course.lessons.filter(
    (lesson) => !isLessonComplete(progress, course.id, lesson.id),
  );
  return { unlocked: remaining.length === 0, remaining };
}

/** When a failed exam can be retaken. With no cooldown configured, that's right away. */
export function retakeAvailableAt(
  lastFailedAt: Date | undefined,
  cooldownHours: number = appConfig.assessment.retakeCooldownHours,
): Date | undefined {
  if (!lastFailedAt || cooldownHours <= 0) return undefined;
  return new Date(lastFailedAt.getTime() + cooldownHours * 3_600_000);
}
