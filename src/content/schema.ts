import "../lib/zod-setup";

import { z } from "zod";

/**
 * The shape of all bundled content. Every entry is validated by
 * content.test.ts, so a malformed spec fails CI instead of shipping.
 */

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");

export const ingredientCategorySchema = z.enum([
  "gin",
  "vodka",
  "rum",
  "agave",
  "whiskey",
  "brandy",
  "other-spirit",
  "liqueur",
  "amaro-aperitif",
  "vermouth-fortified",
  "wine",
  "bitters",
  "citrus",
  "juice",
  "syrup",
  "mixer",
  "dairy-egg",
  "produce",
  "pantry",
]);
export type IngredientCategory = z.infer<typeof ingredientCategorySchema>;

/** Categories a bar stocks as bottles. Everything else is prepped or assumed on hand. */
export const BOTTLE_CATEGORIES: ReadonlySet<IngredientCategory> = new Set([
  "gin",
  "vodka",
  "rum",
  "agave",
  "whiskey",
  "brandy",
  "other-spirit",
  "liqueur",
  "amaro-aperitif",
  "vermouth-fortified",
  "wine",
  "bitters",
]);

export const ingredientSchema = z.object({
  id: slugSchema,
  name: z.string().min(2),
  category: ingredientCategorySchema,
});
export type Ingredient = z.infer<typeof ingredientSchema>;

export const amountSchema = z.discriminatedUnion("unit", [
  z.object({ unit: z.literal("ml"), value: z.number().positive().multipleOf(2.5) }),
  z.object({ unit: z.literal("dash"), value: z.number().positive() }),
  z.object({ unit: z.literal("drop"), value: z.number().positive() }),
  z.object({ unit: z.literal("barspoon"), value: z.number().positive() }),
  z.object({ unit: z.literal("tsp"), value: z.number().positive() }),
  z.object({ unit: z.literal("piece"), value: z.number().positive(), label: z.string().min(2) }),
  z.object({ unit: z.literal("pinch") }),
  z.object({ unit: z.literal("few-drops") }),
  z.object({ unit: z.literal("splash") }),
  z.object({ unit: z.literal("top") }),
  z.object({ unit: z.literal("to-taste") }),
]);
export type Amount = z.infer<typeof amountSchema>;

export const specLineSchema = z.object({
  ingredient: slugSchema,
  amount: amountSchema,
  note: z.string().min(2).optional(),
  optional: z.boolean().optional(),
});
export type SpecLine = z.infer<typeof specLineSchema>;

export const glassSchema = z.enum([
  "cocktail",
  "coupe",
  "rocks",
  "highball",
  "collins",
  "flute",
  "wine",
  "copper-mug",
  "julep-cup",
  "hurricane",
  "irish-coffee",
]);
export type Glass = z.infer<typeof glassSchema>;

export const iceSchema = z.enum(["none", "cubes", "large-cube", "crushed"]);
export type Ice = z.infer<typeof iceSchema>;

export const methodSchema = z.enum(["shake", "stir", "build", "blend", "swizzle"]);
export type Method = z.infer<typeof methodSchema>;

export const techniqueSchema = z.enum([
  "dry-shake",
  "double-strain",
  "muddle",
  "float",
  "rinse",
  "top",
  "rim",
  "layer",
]);
export type Technique = z.infer<typeof techniqueSchema>;

export const familySchema = z.enum([
  "sour",
  "spirit-forward",
  "old-fashioned",
  "highball",
  "fizz-collins",
  "julep-smash",
  "tiki-tropical",
  "sparkling",
  "duo-trio",
  "cream-flip",
  "hot",
]);
export type Family = z.infer<typeof familySchema>;

export const baseSpiritSchema = z.enum([
  "gin",
  "vodka",
  "rum",
  "agave",
  "whiskey",
  "brandy",
  "aperitif",
  "other",
]);
export type BaseSpirit = z.infer<typeof baseSpiritSchema>;

export const sourceSchema = z.object({
  name: z.string().min(2),
  url: z.url().startsWith("https://"),
});
export type Source = z.infer<typeof sourceSchema>;

export const ibaCategorySchema = z.enum(["unforgettables", "contemporary-classics", "new-era"]);
export type IbaCategory = z.infer<typeof ibaCategorySchema>;

export const cocktailSchema = z.object({
  id: slugSchema,
  name: z.string().min(2),
  family: familySchema,
  base: baseSpiritSchema,
  /** 1 = build or simple shake; 2 = precision (stirred dilution, 5+ parts); 3 = advanced technique. */
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  method: methodSchema,
  techniques: z.array(techniqueSchema).default([]),
  glass: glassSchema,
  ice: iceSchema,
  garnish: z.string().min(2).nullable(),
  spec: z.array(specLineSchema).min(2),
  steps: z.array(z.string().min(8)).min(1).max(6),
  /** Short, hedged, sourced history. Omitted rather than guessed. */
  history: z.string().min(20).optional(),
  /** Where this spec differs from common US bar practice, or a service tip. */
  note: z.string().min(10).optional(),
  variations: z.array(z.object({ name: z.string(), detail: z.string() })).default([]),
  iba: ibaCategorySchema.optional(),
  sources: z.array(sourceSchema).min(1),
});
export type CocktailInput = z.input<typeof cocktailSchema>;
export type Cocktail = z.output<typeof cocktailSchema>;
