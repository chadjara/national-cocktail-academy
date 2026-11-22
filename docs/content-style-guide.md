# Content style guide

How specs and lessons are written, sourced and classified. Content is the product, so these rules
are enforced by `src/content/content.test.ts` wherever a machine can check them.

## Sources

- **Every drink cites at least one source.** It's shown on the spec page.
- **IBA drinks** use the IBA official spec. The data was imported from the
  [rasmusab/iba-cocktails](https://github.com/rasmusab/iba-cocktails) dataset (MIT), scraped from
  iba-world.com. `src/content/fixtures/iba-ml-snapshot.json` snapshots every ml figure, and a test
  fails if our spec drops or changes one.
- **Drinks outside the IBA list** need at least two independent, published professional sources:
  the creator's bar, Difford's Guide, PUNCH, Imbibe, or a recognised book as cited online. Use only
  consensus specs. If sources disagree and there's no clear standard, leave the drink out. (The
  Chartreuse Swizzle is out for that reason.)
- **Retired IBA drinks** (Golden Dream, Barracuda, Yellow Bird, dropped in the 2024 revision) are not
  taught.

## Writing

- **Ingredient lists are facts and are copied exactly.** Methods, notes and history are written fresh
  in our voice and never pasted from a source.
- **Voice:** a head bartender running a training shift. Direct, specific, no exclamation marks, no
  emoji. See the Voice section of `/design-system`.
- **Steps:** 1–6 short imperative sentences in service order, including glass prep.
- **History:** one or two sentences, hedged when sources disagree ("commonly credited to…"). If the
  origin is unknown or contested beyond a sentence, leave it out. Never invent a date.
- **"Behind the bar" notes:** say where the IBA spec differs from common US bar practice (e.g.
  Margarita, Old Fashioned, Bee's Knees), or give a service tip. Never silently change an IBA spec.

## Units

- Store **ml**, in multiples of 2.5 (the schema enforces this). Display oz using the bar convention
  **30 ml = 1 oz**, so 22.5 ml reads ¾ oz. Amounts off a jigger line display with "≈".
- Use bar units where the source does: dash, drop, barspoon, tsp, few drops, splash, top, to taste.
  Counted items (mint leaves, ginger slices) are `piece` with a description.
- Mark optional ingredients `optional: true`. They never block a drink in My Bar.

## Classification

| Field          | Rule                                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Family**     | The template the drink teaches: sour, spirit-forward, old fashioned, highball, fizz & collins, julep & smash, tiki & tropical, sparkling, duo & trio, cream & flip, hot.                                            |
| **Base**       | The spirit that leads the drink; `aperitif` for low-ABV aperitivo drinks; `other` when there's no single base (Long Island, Trinidad Sour).                                                                         |
| **Difficulty** | 1 Foundation: built, or a simple shake of up to 4 parts. 2 Intermediate: stirred dilution, muddling, 5+ parts, or a top. 3 Advanced: dry shake, float or layer precision, swizzle, rim prep, or multi-stage shakes. |
| **Glass**      | One of the drawn glass shapes. Add a shape to the design system before using a new glass.                                                                                                                           |

## Garnishes

Garnishes follow IBA conventions where IBA gives one, and the cited source otherwise. They're listed
for a working bartender's review before launch, because the dataset didn't include them.

## Review before launch

A working head bartender reviews every spec, garnish and note before launch (M7). Record review
corrections as normal commits so the history shows what changed and why.
