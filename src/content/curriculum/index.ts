import { barTools } from "./courses/bar-tools";
import {
  afterDinner,
  fizzesAndCollinses,
  highballs,
  julepsAndSmashes,
  martinisAndManhattans,
  oldFashioneds,
  sours,
  sparkling,
  tiki,
} from "./courses/families";
import { garnishes } from "./courses/garnishes";
import { glasswareAndIce } from "./courses/glassware-and-ice";
import { service } from "./courses/service";
import { technique } from "./courses/technique";
import type {
  Block,
  BlockInput,
  Course,
  CourseGroup,
  CourseInput,
  Lesson,
  ToolId,
  Tool,
} from "./schema";
import { tools } from "./tools";

/**
 * The read-only curriculum API. Like the cocktail content, courses are
 * validated against their schema in curriculum.test.ts rather than parsed on
 * every launch; this module only fills in the schema's defaults.
 */

/** Every authored course, in the recommended order. Exported for the schema tests. */
export const rawCourses: readonly CourseInput[] = [
  barTools,
  glasswareAndIce,
  technique,
  garnishes,
  service,
  sours,
  martinisAndManhattans,
  oldFashioneds,
  highballs,
  fizzesAndCollinses,
  julepsAndSmashes,
  tiki,
  sparkling,
  afterDinner,
];

function withBlockDefaults(block: BlockInput): Block {
  switch (block.kind) {
    case "key-points":
      return { ...block, title: block.title ?? "Remember" };
    case "drill":
      return { ...block, mode: block.mode ?? "every-facet" };
    default:
      return block;
  }
}

const courses: readonly Course[] = rawCourses.map((course) => ({
  ...course,
  lessons: course.lessons.map((lesson) => ({
    ...lesson,
    blocks: lesson.blocks.map(withBlockDefaults),
  })),
}));

const courseById = new Map(courses.map((course) => [course.id, course]));
const toolById = new Map(tools.map((tool) => [tool.id, tool]));

export const courseGroupLabels: Record<CourseGroup, { label: string; summary: string }> = {
  foundations: {
    label: "Foundations",
    summary: "Tools, glassware, technique, garnishes and service. Start here.",
  },
  families: {
    label: "Drink families",
    summary: "Learn the classics family by family, from the template to the spec.",
  },
};

export function listCourses(): readonly Course[] {
  return courses;
}

export function getCourse(id: string): Course | undefined {
  return courseById.get(id);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  return getCourse(courseId)?.lessons.find((lesson) => lesson.id === lessonId);
}

export function getTool(id: ToolId): Tool {
  const tool = toolById.get(id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}

export function listTools(): readonly Tool[] {
  return tools;
}

export type LessonRef = { courseId: string; lessonId: string };

/** Every lesson in the recommended order, across all courses. */
export function listLessonRefs(): readonly LessonRef[] {
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({ courseId: course.id, lessonId: lesson.id })),
  );
}

/** The lesson after this one in its course, if any. */
export function nextLessonInCourse(courseId: string, lessonId: string): Lesson | undefined {
  const lessons = getCourse(courseId)?.lessons ?? [];
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index === -1 ? undefined : lessons[index + 1];
}

export type {
  Block,
  Course,
  CourseGroup,
  DrillFacet,
  Lesson,
  Question,
  Tool,
  ToolId,
} from "./schema";
