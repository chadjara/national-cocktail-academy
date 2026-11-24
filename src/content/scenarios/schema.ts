import "../../lib/zod-setup";

import { z } from "zod";

import { slugSchema } from "../schema";

/**
 * Responsible Service scenarios: short branching situations behind the bar.
 * Every choice is weighted and explained, so a student learns why a response
 * is safe, merely acceptable, or unsafe. Checked by scenarios.test.ts.
 */

export const scenarioOutcomeSchema = z.enum(["best", "acceptable", "unsafe"]);
export type ScenarioOutcome = z.infer<typeof scenarioOutcomeSchema>;

export const scenarioChoiceSchema = z.object({
  text: z.string().min(5),
  outcome: scenarioOutcomeSchema,
  feedback: z.string().min(20),
  /** The node this choice leads to. Omitted when the choice ends the scenario. */
  next: slugSchema.optional(),
});
export type ScenarioChoice = z.infer<typeof scenarioChoiceSchema>;

export const scenarioNodeSchema = z.object({
  id: slugSchema,
  /** What happens, or what the guest says. */
  guest: z.string().min(10),
  choices: z.array(scenarioChoiceSchema).min(2).max(4),
});
export type ScenarioNode = z.infer<typeof scenarioNodeSchema>;

export const scenarioSchema = z.object({
  id: slugSchema,
  title: z.string().min(3),
  /** Where you are and what's going on, before the first decision. */
  setting: z.string().min(20),
  start: slugSchema,
  nodes: z.array(scenarioNodeSchema).min(1),
});
export type Scenario = z.infer<typeof scenarioSchema>;
