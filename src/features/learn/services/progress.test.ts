import { describe, expect, it } from "vitest";

/** Narrows away undefined, failing the test with a clear message instead. */
function defined<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("expected a value");
  return value;
}

import { getCourse, listCourses } from "~/content/curriculum";

import { courseProgress, emptyProgress, recommendNext, type Progress } from "./progress";

function progress(keys: string[], latest?: [string, string]): Progress {
  return {
    completed: new Set(keys),
    latest: latest && { courseId: latest[0], lessonId: latest[1] },
  };
}

describe("progress", () => {
  it("starts a new student at the first lesson of Bar Tools", () => {
    const next = recommendNext(listCourses(), emptyProgress, new Set());
    expect(next?.course.id).toBe("bar-tools");
    expect(next).toMatchObject({ kind: "lesson", lesson: { id: "your-station" }, started: false });
  });

  it("continues in the course the student was last working in", () => {
    const next = recommendNext(
      listCourses(),
      progress(["sours/the-sour-template"], ["sours", "the-sour-template"]),
      new Set(),
    );
    expect(next?.course.id).toBe("sours");
    expect(next).toMatchObject({ kind: "lesson", lesson: { id: "daiquiri" }, started: true });
  });

  it("moves on in the recommended order once that course is finished", () => {
    const tools = defined(getCourse("bar-tools"));
    const keys = tools.lessons.map((lesson) => `bar-tools/${lesson.id}`);
    const finished = progress(keys, ["bar-tools", "tools-review"]);
    const exam = recommendNext(listCourses(), finished, new Set());
    expect(exam).toMatchObject({ kind: "exam", course: { id: "bar-tools" } });
    const next = recommendNext(listCourses(), finished, new Set(["bar-tools"]));
    expect(next?.course.id).toBe("glassware-and-ice");
    expect(courseProgress(tools, progress(keys))).toEqual({
      done: tools.lessons.length,
      total: tools.lessons.length,
    });
  });

  it("has nothing to recommend once every lesson is finished and every exam passed", () => {
    const keys = listCourses().flatMap((course) =>
      course.lessons.map((lesson) => `${course.id}/${lesson.id}`),
    );
    const allPassed = new Set(listCourses().map((course) => course.id));
    expect(recommendNext(listCourses(), progress(keys), allPassed)).toBeUndefined();
    expect(recommendNext(listCourses(), progress(keys), new Set())?.kind).toBe("exam");
  });
});
