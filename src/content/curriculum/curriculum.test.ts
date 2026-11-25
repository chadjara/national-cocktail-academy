import { describe, expect, it } from "vitest";

import { getCocktail } from "../index";
import { getScenario, listScenarios } from "../scenarios";
import { getCourse, listCourses, listLessonRefs, nextLessonInCourse, rawCourses } from "./index";
import { courseSchema, toolIdSchema, toolSchema } from "./schema";
import { tools } from "./tools";

describe("curriculum", () => {
  it("every course matches the schema", () => {
    for (const course of rawCourses) {
      const result = courseSchema.safeParse(course);
      expect(result.success, `${course.id}: ${result.error?.message ?? ""}`).toBe(true);
    }
  });

  it("course ids are unique, and lesson ids are unique within each course", () => {
    const ids = listCourses().map((course) => course.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const course of listCourses()) {
      const lessonIds = course.lessons.map((lesson) => lesson.id);
      expect(new Set(lessonIds).size, course.id).toBe(lessonIds.length);
      // "exam" is the course exam's route segment.
      expect(lessonIds, course.id).not.toContain("exam");
    }
  });

  it("every cocktail a lesson references exists in the library", () => {
    for (const course of listCourses()) {
      for (const lesson of course.lessons) {
        for (const block of lesson.blocks) {
          const ids =
            block.kind === "cocktail"
              ? [block.cocktailId]
              : block.kind === "drill"
                ? block.cocktailIds
                : [];
          for (const id of ids)
            expect(getCocktail(id), `${course.id}/${lesson.id} → ${id}`).toBeDefined();
        }
      }
    }
  });

  it("family courses only teach drinks from their family", () => {
    for (const course of listCourses()) {
      if (!course.family) continue;
      for (const lesson of course.lessons) {
        for (const block of lesson.blocks) {
          if (block.kind !== "cocktail") continue;
          expect(getCocktail(block.cocktailId)?.family, `${course.id} → ${block.cocktailId}`).toBe(
            course.family,
          );
        }
      }
    }
  });

  it("every lesson asks at least one question or plays a scenario", () => {
    for (const course of listCourses()) {
      for (const lesson of course.lessons) {
        const asks = lesson.blocks.some(
          (block) =>
            block.kind === "question" || block.kind === "drill" || block.kind === "scenario",
        );
        expect(asks, `${course.id}/${lesson.id}`).toBe(true);
      }
    }
  });

  it("every scenario a lesson plays exists, and every scenario is taught", () => {
    const used = new Set<string>();
    for (const course of listCourses()) {
      for (const lesson of course.lessons) {
        for (const block of lesson.blocks) {
          if (block.kind !== "scenario") continue;
          expect(
            getScenario(block.scenarioId),
            `${course.id}/${lesson.id} → ${block.scenarioId}`,
          ).toBeDefined();
          used.add(block.scenarioId);
        }
      }
    }
    expect([...used].sort()).toEqual(
      listScenarios()
        .map((s) => s.id)
        .sort(),
    );
  });

  it("the tool catalog covers every tool exactly once", () => {
    for (const tool of tools) expect(toolSchema.safeParse(tool).success, tool.id).toBe(true);
    expect(tools.map((tool) => tool.id).sort()).toEqual([...toolIdSchema.options].sort());
  });

  it("every tool is taught in the Bar Tools course", () => {
    const taught = new Set(
      getCourse("bar-tools")?.lessons.flatMap((lesson) =>
        lesson.blocks.flatMap((block) => (block.kind === "tools" ? block.tools : [])),
      ),
    );
    for (const id of toolIdSchema.options) expect(taught.has(id), id).toBe(true);
  });

  it("walks lessons in order", () => {
    const refs = listLessonRefs();
    expect(refs[0]).toEqual({ courseId: "bar-tools", lessonId: "your-station" });
    expect(nextLessonInCourse("bar-tools", "your-station")?.id).toBe("measuring");
    expect(nextLessonInCourse("bar-tools", "tools-review")).toBeUndefined();
  });
});
