import "~/lib/zod-setup";

import { z } from "zod";

/**
 * Product configuration. Everything an academy owner would reasonably want to
 * change without touching feature code lives here, and is validated at import
 * time so a bad value fails the build instead of shipping.
 */
const appConfigSchema = z.object({
  academy: z.object({
    name: z.string().min(2).max(40),
    shortName: z.string().min(2).max(12),
    tagline: z.string().min(10).max(90),
    /** Stated wherever the name could be mistaken for an official institution. */
    disclaimer: z.string().min(20),
    /** The official, publisher-hosted privacy policy (also used in App Store Connect). */
    privacyPolicyUrl: z.url().startsWith("https://"),
    /** How people reach the publisher; shown in the privacy policy. */
    contactUrl: z.url().startsWith("https://"),
  }),
  ageGate: z.discriminatedUnion("mode", [
    z.object({
      mode: z.literal("confirm-age"),
      minimumAge: z.number().int().min(18).max(25),
      region: z.string().min(2),
    }),
    z.object({
      mode: z.literal("professional-training-framing"),
    }),
  ]),
  units: z.object({
    default: z.enum(["oz", "ml"]),
    mlPerOz: z.literal(30),
  }),
  assessment: z.object({
    passMarkPercent: z.number().int().min(50).max(100),
    retakeCooldownHours: z.number().int().min(0).max(168),
  }),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export const appConfig: AppConfig = appConfigSchema.parse({
  academy: {
    name: "National Cocktail Academy",
    shortName: "NCA",
    tagline: "Professional bartending, from first pour to running the well.",
    disclaimer:
      "National Cocktail Academy is an independent training app, not an accredited school or a government body.",
    privacyPolicyUrl: "https://cjaratech.com/national-cocktail-academy/privacy",
    contactUrl: "https://cjaratech.com/contact.html",
  },
  ageGate: {
    mode: "confirm-age",
    minimumAge: 21,
    region: "United States",
  },
  units: {
    default: "oz",
    mlPerOz: 30,
  },
  assessment: {
    passMarkPercent: 80,
    retakeCooldownHours: 0,
  },
});
