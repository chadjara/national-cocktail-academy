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
    const next = recommendNext(listCourses(), emptyProgress);
    expect(next?.course.id).toBe("bar-tools");
    expect(next?.lesson.id).toBe("your-station");
    expect(next?.started).toBe(false);
  });

  it("continues in the course the student was last working in", () => {
    const next = recommendNext(
      listCourses(),
      progress(["sours/the-sour-template"], ["sours", "the-sour-template"]),
    );
    expect(next?.course.id).toBe("sours");
    expect(next?.lesson.id).toBe("daiquiri");
    expect(next?.started).toBe(true);
  });

  it("moves on in the recommended order once that course is finished", () => {
    const tools = defined(getCourse("bar-tools"));
    const keys = tools.lessons.map((lesson) => `bar-tools/${lesson.id}`);
    const next = recommendNext(listCourses(), progress(keys, ["bar-tools", "tools-review"]));
    expect(next?.course.id).toBe("glassware-and-ice");
    expect(courseProgress(tools, progress(keys))).toEqual({
      done: tools.lessons.length,
      total: tools.lessons.length,
    });
  });

  it("has nothing to recommend when every lesson is finished", () => {
    const keys = listCourses().flatMap((course) =>
      course.lessons.map((lesson) => `${course.id}/${lesson.id}`),
    );
    expect(recommendNext(listCourses(), progress(keys))).toBeUndefined();
  });
});
