import "../../lib/zod-setup";

import { z } from "zod";

import { familySchema, glassSchema, slugSchema } from "../schema";

/**
 * The shape of the academy's courses. Lessons are built from blocks so that
 * prose, visuals, live specs from the library and questions can be mixed, and
 * every reference (cocktail, glass, tool) is checked by curriculum.test.ts.
 */

export const toolIdSchema = z.enum([
  "jigger",
  "boston-shaker",
  "cobbler-shaker",
  "hawthorne-strainer",
  "julep-strainer",
  "fine-strainer",
  "barspoon",
  "mixing-glass",
  "muddler",
  "peeler",
  "channel-knife",
  "paring-knife",
  "speed-pourer",
  "ice-scoop",
  "bar-mat",
  "citrus-press",
]);
export type ToolId = z.infer<typeof toolIdSchema>;

export const toolSchema = z.object({
  id: toolIdSchema,
  name: z.string().min(2),
  summary: z.string().min(10),
});
export type Tool = z.infer<typeof toolSchema>;

export const questionSchema = z
  .object({
    prompt: z.string().min(5),
    options: z.array(z.string().min(1)).min(2).max(5),
    answer: z.number().int().min(0),
    explanation: z.string().min(10),
  })
  .refine((q) => q.answer < q.options.length, { message: "answer must index an option" })
  .refine((q) => new Set(q.options).size === q.options.length, {
    message: "options must be unique",
  });
export type Question = z.infer<typeof questionSchema>;

export const drillFacetSchema = z.enum([
  "glass",
  "method",
  "garnish",
  "amount",
  "ingredient",
  "ice",
]);
export type DrillFacet = z.infer<typeof drillFacetSchema>;

export const blockSchema = z.discriminatedUnion("kind", [
  /** Prose. Each string is one paragraph. */
  z.object({ kind: z.literal("text"), paragraphs: z.array(z.string().min(10)).min(1) }),
  /** The few things to remember, as a short list. */
  z.object({
    kind: z.literal("key-points"),
    title: z.string().default("Remember"),
    items: z.array(z.string().min(2)).min(2),
  }),
  /** A behind-the-bar tip or a warning. */
  z.object({
    kind: z.literal("callout"),
    tone: z.enum(["tip", "warning"]),
    title: z.string().min(2),
    text: z.string().min(10),
  }),
  /** Numbered how-to steps. */
  z.object({
    kind: z.literal("steps"),
    title: z.string().min(2),
    items: z.array(z.string().min(5)).min(2),
  }),
  /** A bar tool with its illustration and what it's for. */
  z.object({ kind: z.literal("tools"), tools: z.array(toolIdSchema).min(1) }),
  /** One or more glasses with their illustration and what goes in them. */
  z.object({
    kind: z.literal("glasses"),
    items: z.array(z.object({ glass: glassSchema, use: z.string().min(10) })).min(1),
  }),
  /** A live spec card pulled from the library (spec, glass, ice, garnish, method). */
  z.object({ kind: z.literal("cocktail"), cocktailId: slugSchema }),
  /** An authored question. */
  z.object({ kind: z.literal("question"), question: questionSchema }),
  /**
   * Questions generated from library data for one or more drinks, so a spec
   * can never be taught one way and quizzed another.
   */
  z.object({
    kind: z.literal("drill"),
    cocktailIds: z.array(slugSchema).min(1),
    facets: z.array(drillFacetSchema).min(1),
    /**
     * "every-facet" asks each facet about each drink (a lesson on one drink);
     * "rotate" asks one question per drink, cycling through the facets (a review).
     */
    mode: z.enum(["every-facet", "rotate"]).default("every-facet"),
  }),
]);
export type Block = z.infer<typeof blockSchema>;
export type BlockInput = z.input<typeof blockSchema>;

export const lessonSchema = z.object({
  id: slugSchema,
  title: z.string().min(3),
  summary: z.string().min(10),
  blocks: z.array(blockSchema).min(1),
});
export type Lesson = z.infer<typeof lessonSchema>;
export type LessonInput = z.input<typeof lessonSchema>;

export const courseGroupSchema = z.enum(["foundations", "families"]);
export type CourseGroup = z.infer<typeof courseGroupSchema>;

export const courseSchema = z.object({
  id: slugSchema,
  group: courseGroupSchema,
  title: z.string().min(3),
  summary: z.string().min(20),
  /** The glass or tool drawn on the course card. */
  icon: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("glass"), glass: glassSchema }),
    z.object({ kind: z.literal("tool"), tool: toolIdSchema }),
  ]),
  /** For drink-family courses: the library family it teaches. */
  family: familySchema.optional(),
  lessons: z.array(lessonSchema).min(1),
});
export type Course = z.infer<typeof courseSchema>;
export type CourseInput = z.input<typeof courseSchema>;
