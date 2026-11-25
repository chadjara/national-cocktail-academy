import { describe, expect, it } from "vitest";

import { listCourses } from "~/content/curriculum";
import type { ExamStatus } from "~/features/learn/hooks/use-exams";

import { certificateEligibility } from "./eligibility";

const passed: ExamStatus = { attempts: 1, best: undefined, latest: undefined, passed: true };

describe("certificate eligibility", () => {
  it("lists every course exam plus the Service Sim", () => {
    const result = certificateEligibility(listCourses(), new Map(), undefined);
    expect(result.total).toBe(listCourses().length + 1);
    expect(result).toMatchObject({ done: 0, eligible: false });
    expect(result.requirements.at(-1)).toMatchObject({ id: "capstone", to: "/capstone" });
  });

  it("is eligible only when every exam and the Service Sim are passed", () => {
    const allExams = new Map(listCourses().map((c) => [c.id, passed]));
    expect(
      certificateEligibility(listCourses(), allExams, {
        attempts: 1,
        passed: false,
        best: undefined,
      }).eligible,
    ).toBe(false);
    expect(
      certificateEligibility(listCourses(), allExams, {
        attempts: 1,
        passed: true,
        best: undefined,
      }).eligible,
    ).toBe(true);
    const missingOne = new Map(allExams);
    missingOne.delete("sours");
    expect(
      certificateEligibility(listCourses(), missingOne, {
        attempts: 1,
        passed: true,
        best: undefined,
      }).eligible,
    ).toBe(false);
  });
});
