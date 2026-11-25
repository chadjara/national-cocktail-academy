import type {
  BaseSpirit,
  Family,
  Glass,
  IbaCategory,
  Ice,
  IngredientCategory,
  Method,
  Technique,
} from "./schema";

/** Display labels and teaching blurbs for every enum in the content model. */

export const familyLabels: Record<Family, { label: string; summary: string }> = {
  sour: { label: "Sours", summary: "Spirit, citrus and sugar in balance." },
  "spirit-forward": {
    label: "Martinis & Manhattans",
    summary: "Stirred, strong, judged on dilution.",
  },
  "old-fashioned": { label: "Old Fashioneds", summary: "Spirit, sugar, bitters, water." },
  highball: { label: "Highballs", summary: "A spirit lengthened with a mixer over ice." },
  "fizz-collins": { label: "Fizzes & Collinses", summary: "A sour lengthened with soda." },
  "julep-smash": {
    label: "Juleps & Smashes",
    summary: "Muddled herbs or fruit, often crushed ice.",
  },
  "tiki-tropical": { label: "Tiki & Tropical", summary: "Layered rums, citrus and spice." },
  sparkling: { label: "Sparkling", summary: "Built on Champagne, Prosecco or wine." },
  "duo-trio": { label: "Duos & Trios", summary: "A spirit and a liqueur, sometimes with cream." },
  "cream-flip": { label: "Cream & Flips", summary: "Rich drinks with cream or whole egg." },
  hot: { label: "Hot Drinks", summary: "Served warm." },
};

export const baseSpiritLabels: Record<BaseSpirit, string> = {
  gin: "Gin",
  vodka: "Vodka",
  rum: "Rum & cane",
  agave: "Tequila & mezcal",
  whiskey: "Whiskey",
  brandy: "Brandy",
  aperitif: "Aperitif & wine",
  other: "Other",
};

export const methodLabels: Record<Method, string> = {
  shake: "Shaken",
  stir: "Stirred",
  build: "Built",
  blend: "Blended",
  swizzle: "Swizzled",
};

export const glassLabels: Record<Glass, string> = {
  cocktail: "Cocktail glass",
  coupe: "Coupe",
  rocks: "Rocks glass",
  highball: "Highball",
  collins: "Collins",
  flute: "Flute",
  wine: "Wine glass",
  "copper-mug": "Copper mug",
  "julep-cup": "Julep cup",
  hurricane: "Hurricane",
  "irish-coffee": "Irish coffee glass",
};

export const iceLabels: Record<Ice, string> = {
  none: "Served up, no ice",
  cubes: "Cubed ice",
  "large-cube": "One large cube",
  crushed: "Crushed ice",
};

export const techniqueLabels: Record<Technique, string> = {
  "dry-shake": "Dry shake",
  "double-strain": "Double strain",
  muddle: "Muddle",
  float: "Float",
  rinse: "Rinse",
  top: "Top",
  rim: "Rim",
  layer: "Layer",
};

export const difficultyLabels: Record<1 | 2 | 3, string> = {
  1: "Foundation",
  2: "Intermediate",
  3: "Advanced",
};

export const ibaLabels: Record<IbaCategory, string> = {
  unforgettables: "IBA · The Unforgettables",
  "contemporary-classics": "IBA · Contemporary Classics",
  "new-era": "IBA · New Era",
};

export const ingredientCategoryLabels: Record<IngredientCategory, string> = {
  gin: "Gin",
  vodka: "Vodka",
  rum: "Rum & cane",
  agave: "Tequila & mezcal",
  whiskey: "Whiskey",
  brandy: "Brandy",
  "other-spirit": "Other spirits",
  liqueur: "Liqueurs",
  "amaro-aperitif": "Amari & aperitifs",
  "vermouth-fortified": "Vermouth & fortified wine",
  wine: "Wine",
  bitters: "Bitters",
  citrus: "Citrus",
  juice: "Juices",
  syrup: "Syrups",
  mixer: "Mixers",
  "dairy-egg": "Dairy & egg",
  produce: "Produce",
  pantry: "Pantry",
};

/** Each family's color, used for covers and illustration backdrops (tokens.css --tone-*). */
export const familyTones: Record<
  Family,
  "citrus" | "crimson" | "amber" | "copper" | "slate" | "emerald" | "teal" | "champagne" | "mocha"
> = {
  sour: "citrus",
  "spirit-forward": "crimson",
  "old-fashioned": "amber",
  highball: "copper",
  "fizz-collins": "slate",
  "julep-smash": "emerald",
  "tiki-tropical": "teal",
  sparkling: "champagne",
  "duo-trio": "mocha",
  "cream-flip": "mocha",
  hot: "mocha",
};
