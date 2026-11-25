import type { Course } from "~/content/curriculum";
import type { ExamStatuses } from "~/features/learn/hooks/use-exams";
import type { CapstoneStatus } from "~/features/practice/hooks/use-capstone";

export type Requirement = { id: string; label: string; done: boolean; to: string };

export type Eligibility = {
  requirements: Requirement[];
  done: number;
  total: number;
  eligible: boolean;
};

/** What the certificate needs: every course exam passed, then the Service Sim. */
export function certificateEligibility(
  courses: readonly Course[],
  exams: ExamStatuses,
  capstone: CapstoneStatus | undefined,
): Eligibility {
  const requirements: Requirement[] = [
    ...courses.map((course) => ({
      id: `exam:${course.id}`,
      label: `${course.title} exam`,
      done: exams.get(course.id)?.passed ?? false,
      to: `/learn/${course.id}`,
    })),
    { id: "capstone", label: "Service Sim", done: capstone?.passed ?? false, to: "/capstone" },
  ];
  const done = requirements.filter((r) => r.done).length;
  return { requirements, done, total: requirements.length, eligible: done === requirements.length };
}
