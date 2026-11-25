import { describe, expect, it } from "vitest";

import { listCourses } from "~/content/curriculum";

import { courseArt, coveredCourseIds } from "./course-art";

describe("course covers", () => {
  it("every course has a cover photo and a tone", () => {
    expect(coveredCourseIds.sort()).toEqual(
      listCourses()
        .map((c) => c.id)
        .sort(),
    );
    for (const course of listCourses()) {
      const art = courseArt(course);
      expect(art.photo?.src, course.id).toMatch(
        /^\/images\/(drinks|scenes)\/[a-z0-9-]+(-small)?\.webp$/,
      );
      expect(art.tone, course.id).toBeTruthy();
    }
  });
});
