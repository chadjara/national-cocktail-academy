import "../lib/zod-setup";

import { z } from "zod";

import { slugSchema } from "./schema";

/**
 * Every photo in the app, with its credit and license. Photos are bundled in
 * public/images (nothing is fetched), and only licenses that allow use in an
 * app are accepted: CC0, public domain, CC BY, or the owner's own photos.
 * Drink photos were chosen only where they match the spec: glass, color and
 * garnish. Every other drink uses its illustration.
 *
 * To replace a photo with your own: run `pnpm images:process <photo> drink <id>`,
 * then set its entry's author to "National Cocktail Academy" and its license
 * to "Owner's photo". photos.test.ts checks every entry has its files.
 */

export const photoLicenseSchema = z.enum([
  "CC0",
  "Public domain",
  "CC BY 2.0",
  "CC BY 3.0",
  "CC BY 4.0",
  "Owner's photo",
]);

export const photoCreditSchema = z.object({
  id: slugSchema,
  author: z.string().min(1),
  title: z.string().min(1),
  source: z.string().min(1),
  sourceUrl: z.url().startsWith("https://"),
  license: photoLicenseSchema,
  /** Required for Creative Commons licenses; owner's photos have none. */
  licenseUrl: z.url().optional(),
});
export type PhotoCredit = z.infer<typeof photoCreditSchema>;

export const scenePhotoSchema = photoCreditSchema.extend({ alt: z.string().min(10) });
export type ScenePhoto = z.infer<typeof scenePhotoSchema>;

/** Photos of drinks, keyed by cocktail id. Files: public/images/drinks/<id>.webp and <id>-thumb.webp. */
export const drinkPhotos: readonly PhotoCredit[] = [
  {
    id: "americano",
    author: "Wine Dharma",
    title: "Americano cocktail recipe, drinking Americano, vermouth and bitter cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/31027007@N08/29291564872",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "aviation",
    author: "Didriks",
    title: "18",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/49889671@N03/6127142463",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "bellini",
    author: "Tim Reckmann (ccnull.de)",
    title: "Bellini Cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/115225894@N07/53560809716",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "black-russian",
    author: "Tim Reckmann (ccnull.de)",
    title: "Black Russian Cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/115225894@N07/53502962927",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "bramble",
    author: "StuartWebster",
    title: "Ramble",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/34883952@N02/4211945242",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "clover-club",
    author: "Bex.Walton",
    title: "The eponymous Clover Club cocktail at Clover Club",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/7831824@N04/30538075011",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "cosmopolitan",
    author: "rick",
    title: "cosmopolitans",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/35034361412@N01/2064305576",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "cuba-libre",
    author: "Tim Reckmann (ccnull.de)",
    title: "Cuba Libre Cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/115225894@N07/53441967975",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "dry-martini",
    author: "ryan.merkley",
    title:
      "The 9th Day of Cocktail Christmas is Joy Division. Gin, Cointreau, dry vermouth, and 3 das",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/58522581@N07/51767691143",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "espresso-martini",
    author: "Tim Reckmann (ccnull.de)",
    title: "Espresso Martini mit Kaffeebohnen",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/115225894@N07/54370809927",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "gimlet",
    author: "Tim Reckmann (ccnull.de)",
    title: "Gimlet Cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/115225894@N07/53457787167",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "hanky-panky",
    author: "Dan4th",
    title: "Hanky Panky",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/43264265@N00/5458878980",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "jack-rose",
    author: "dalecruse",
    title: "Jack Rose cocktail at Eastern Standard",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/91873384@N04/9677531775",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "jungle-bird",
    author: "BanjoZebra",
    title: "Jungle bird cocktail",
    source: "Wikimedia",
    sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=155573774",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "kir",
    author: "sarahstierch",
    title: "Kir Royale",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/7633518@N08/51574897078",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "last-word",
    author: "jspatchwork",
    title: "20140419 Last Word Cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/23126594@N00/13916571311",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "lemon-drop-martini",
    author: "daveparker",
    title: "Lemon Drop",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/92155448@N00/4339036733",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "long-island-iced-tea",
    author: "Tim Reckmann (ccnull.de)",
    title: "Long Island Iced Tea Cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/115225894@N07/53471596251",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "manhattan",
    author: "naotakem",
    title: "Manhattan Cocktail",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/12832970@N00/6992048786",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "mary-pickford",
    author: "goodiesfirst",
    title: "astor room mary pickford",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/49215102@N00/6304674498",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "mimosa",
    author: "sarahstierch",
    title: "Mimosa",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/7633518@N08/51956518736",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "mojito",
    author: "Tim Reckmann (ccnull.de)",
    title: "Erfrischender Mojito-Cocktail auf einem Holzuntergrund",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/115225894@N07/54338213225",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "moscow-mule",
    author: "Wine Dharma",
    title: "Foto Moscow Mule in tazza di rame 1",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/31027007@N08/39054657812",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "negroni",
    author: "Geoff Peters 604",
    title: "Negroni (drink)",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/54359128@N00/3383453027",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "old-fashioned",
    author: "Bex.Walton",
    title: "Old Fashioned cocktail at Kogo",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/7831824@N04/33466918454",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "paper-plane",
    author: "sarahstierch",
    title: "Paper Plane",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/7633518@N08/51346964007",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "paradise",
    author: "StuartWebster",
    title: "Paradise",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/34883952@N02/4599786862",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "pisco-sour",
    author: "JohnSeb",
    title: "Pisco sour",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/69875617@N00/15277948786",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "ramos-fizz",
    author: "ryan.merkley",
    title:
      "The 8th day of cocktail Christmas is the Ramos Gin Fizz. The art of it is to shake that th",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/58522581@N07/52578827634",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "sidecar",
    author: "Farther Along",
    title: "Tonight: sidecars by request from L #hantzhouse #happyhour",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/77315663@N00/20363296948",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "southside",
    author: "goodiesfirst",
    title: "clover club southside fizz",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/49215102@N00/3285775440",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "spritz",
    author: "sarahstierch",
    title: "Aperol Spritz",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/7633518@N08/28191677218",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "vesper",
    author: "cogdogblog",
    title: "Vesper Martini",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/37996646802@N01/19075439716",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
];

/** Scene photos for covers. Files: public/images/scenes/<id>.webp and <id>-small.webp. */
export const scenePhotos: readonly ScenePhoto[] = [
  {
    id: "bar-tools",
    alt: "A bartender's station: shaker tins, Hawthorne and julep strainers and a muddler on a bar mat",
    author: "Southern Foodways Alliance",
    title: "tools of the trade",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/25257922@N07/2653182894",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "garnishes",
    alt: "Whole limes and lemons with cut citrus wheels",
    author: "robbophotos",
    title: "Lemon and lime",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/87994713@N00/486896510",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "glassware-and-ice",
    alt: "Clear ice cubes in a rocks glass",
    author: "nattu",
    title: "What you try, everyday.",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/33345813@N00/3165716469",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "learn",
    alt: "Glasses on a dark bar table lit by candles",
    author: "mripp",
    title: "Talk Talk",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/56218409@N03/14470639002",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "practice",
    alt: "A tall glass of soda beside a lemon on a citrus press",
    author: "jfeuchter",
    title: "Grapefruit Drink.jpg",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/76614238@N00/2630104904",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "service",
    alt: "A curved wooden bar counter with shelves of bottles behind it",
    author: "kawanet",
    title: "Bar Counter - Club Med Sahoro",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/50902562@N00/4165211369",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "spirits",
    alt: "Oak barrels stacked in a warehouse",
    author: "WilsonB",
    title: "Whiskey Barrel Beatz",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/27504933@N00/4213614101",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "technique",
    alt: "A row of shaker tins lined up on a bar",
    author: "walknboston",
    title: "Cocktail Shakers",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/60309882@N00/3564428389",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "tiki",
    alt: "Glowing glass float lamps hanging in a tiki bar",
    author: "jericl cat",
    title: "Bahooka Restaurant and Tiki Bar",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/79761301@N00/5347856807",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "today",
    alt: "A pale cocktail in a stemmed glass beside a shaker on a candlelit bar",
    author: "Leslie Kalohi / nevercoolinschool.com",
    title: "The HollyHood",
    source: "Flickr",
    sourceUrl: "https://www.flickr.com/photos/45502281@N00/3025732567",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
];

const drinkPhotoById = new Map(drinkPhotos.map((photo) => [photo.id, photo]));
const scenePhotoById = new Map(scenePhotos.map((photo) => [photo.id, photo]));

export function getDrinkPhoto(cocktailId: string): PhotoCredit | undefined {
  return drinkPhotoById.get(cocktailId);
}

export function getScenePhoto(id: string): ScenePhoto | undefined {
  return scenePhotoById.get(id);
}

/** Root-relative paths: the app bundle and the preview server both serve public/ at the root. */
export function drinkPhotoSrc(cocktailId: string, size: "full" | "thumb" = "full"): string {
  return `/images/drinks/${cocktailId}${size === "thumb" ? "-thumb" : ""}.webp`;
}

export function scenePhotoSrc(id: string, size: "full" | "small" = "full"): string {
  return `/images/scenes/${id}${size === "small" ? "-small" : ""}.webp`;
}
