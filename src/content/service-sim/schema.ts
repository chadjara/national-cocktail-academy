import "../../lib/zod-setup";

import { z } from "zod";

import { slugSchema } from "../schema";
import { scenarioChoiceSchema } from "../scenarios/schema";

/**
 * A guest moment in the Service Sim: one decision in the middle of a shift.
 * Choices are weighted like scenario choices, without branching.
 */
export const guestMomentSchema = z.object({
  id: slugSchema,
  situation: z.string().min(20),
  choices: z
    .array(scenarioChoiceSchema.omit({ next: true }))
    .min(2)
    .max(4),
});
export type GuestMoment = z.infer<typeof guestMomentSchema>;
