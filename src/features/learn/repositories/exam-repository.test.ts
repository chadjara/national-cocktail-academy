import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AcademyDatabase, setDatabaseForTesting } from "~/lib/db/database";
import type { ExamAttemptRecord } from "~/lib/db/records";

import { summarizeExams } from "../hooks/use-exams";
import { examRepository } from "./exam-repository";

let db: AcademyDatabase;

beforeEach(() => {
  db = new AcademyDatabase(`test-${crypto.randomUUID()}`);
  setDatabaseForTesting(db);
});

afterEach(async () => {
  await db.delete();
});

function attempt(courseId: string, score: number, at: string): Omit<ExamAttemptRecord, "id"> {
  return {
    courseId,
    seed: at,
    questionIds: ["a", "b"],
    score,
    total: 10,
    passed: score >= 8,
    topics: [{ lessonId: "measuring", right: score, total: 10 }],
    startedAt: at,
    submittedAt: at,
  };
}

describe("exam attempts", () => {
  it("stores attempts and summarizes best, latest and passed per course", async () => {
    await examRepository.add(attempt("bar-tools", 6, "2026-11-24T10:00:00.000Z"));
    await examRepository.add(attempt("bar-tools", 9, "2026-11-24T11:00:00.000Z"));
    await examRepository.add(attempt("bar-tools", 7, "2026-11-24T12:00:00.000Z"));
    await examRepository.add(attempt("sours", 5, "2026-11-24T12:30:00.000Z"));

    const statuses = summarizeExams(await examRepository.list());
    const tools = statuses.get("bar-tools");
    expect(tools?.attempts).toBe(3);
    expect(tools?.best?.score).toBe(9);
    expect(tools?.latest?.score).toBe(7);
    expect(tools?.passed).toBe(true);
    expect(statuses.get("sours")?.passed).toBe(false);
  });
});
