import { describe, expect, it } from "vitest";

import { getCourse, listCourses } from "~/content/curriculum";
import { questionSchema } from "~/content/curriculum/schema";

import { buildExam, EXAM_SIZE, examPool, examUnlock, gradeExam, retakeAvailableAt } from "./exam";
import type { Progress } from "./progress";

function course(id: string) {
  const found = getCourse(id);
  if (!found) throw new Error(id);
  return found;
}

describe("exams", () => {
  it("can deal a valid exam for every course, in both unit systems", () => {
    for (const c of listCourses()) {
      for (const units of ["oz", "ml"] as const) {
        const exam = buildExam(c, units, `seed-${c.id}`);
        const pool = examPool(c, units, `seed-${c.id}`);
        expect(exam.length, c.id).toBe(Math.min(EXAM_SIZE, pool.length));
        expect(exam.length, c.id).toBeGreaterThanOrEqual(5);
        expect(new Set(exam.map((q) => q.id)).size, c.id).toBe(exam.length);
        for (const q of exam)
          expect(questionSchema.safeParse(q).success, `${c.id} ${q.id}`).toBe(true);
      }
    }
  });

  it("covers every lesson that has questions when the exam is big enough", () => {
    const sours = course("sours");
    const exam = buildExam(sours, "oz", "spread");
    const lessonsWithQuestions = new Set(examPool(sours, "oz", "spread").map((q) => q.lessonId));
    expect(new Set(exam.map((q) => q.lessonId)).size).toBe(
      Math.min(EXAM_SIZE, lessonsWithQuestions.size),
    );
  });

  it("is stable for a seed and different for another", () => {
    const tools = course("bar-tools");
    expect(buildExam(tools, "oz", "a")).toEqual(buildExam(tools, "oz", "a"));
    const ids = (seed: string) =>
      buildExam(tools, "oz", seed)
        .map((q) => q.id)
        .join(",");
    expect(ids("a")).not.toBe(ids("b"));
  });

  it("grades with a per-lesson breakdown and the pass mark", () => {
    const tools = course("bar-tools");
    const exam = buildExam(tools, "oz", "grade");
    const allRight = gradeExam(
      exam,
      exam.map((q) => q.answer),
      tools,
      80,
    );
    expect(allRight).toMatchObject({ score: exam.length, percent: 100, passed: true, missed: [] });
    expect(allRight.topics.reduce((sum, t) => sum + t.total, 0)).toBe(exam.length);
    const order = tools.lessons.map((l) => l.id);
    const topicOrder = allRight.topics.map((t) => order.indexOf(t.lessonId));
    expect(topicOrder).toEqual([...topicOrder].sort((a, b) => a - b));

    const answers = exam.map((q, i) => (i < 3 ? (q.answer + 1) % q.options.length : q.answer));
    const someWrong = gradeExam(exam, answers, tools, 80);
    expect(someWrong.score).toBe(exam.length - 3);
    expect(someWrong.missed).toHaveLength(3);
    expect(someWrong.passed).toBe(someWrong.percent >= 80);
    expect(gradeExam(exam, [], tools, 80).score).toBe(0);
  });

  it("unlocks only after every lesson in the course is finished", () => {
    const tools = course("bar-tools");
    const none: Progress = { completed: new Set(), latest: undefined };
    expect(examUnlock(tools, none)).toMatchObject({ unlocked: false });
    expect(examUnlock(tools, none).remaining).toHaveLength(tools.lessons.length);
    const all: Progress = {
      completed: new Set(tools.lessons.map((l) => `bar-tools/${l.id}`)),
      latest: undefined,
    };
    expect(examUnlock(tools, all)).toEqual({ unlocked: true, remaining: [] });
  });

  it("allows an immediate retake with no cooldown, and honors one when configured", () => {
    const failed = new Date("2026-11-24T10:00:00Z");
    expect(retakeAvailableAt(failed, 0)).toBeUndefined();
    expect(retakeAvailableAt(failed, 12)?.toISOString()).toBe("2026-11-24T22:00:00.000Z");
  });
});
