# 0014. Imagery: verified photos, spec-drawn illustrations, bundled

**Status:** Accepted · 2026-11-25

## Context

The app read as text and line icons. The owner asked for pictures, accurate professional drink
photos where they exist, and a richer look. They plan to replace photos they don't like with their
own later. Two constraints shape the choices:

- **Accuracy.** The owner corrects content that doesn't match real bars, and a stock "Margarita"
  photo is often the wrong glass, color or garnish.
- **Offline use and privacy.** Every file ships in the app, and the Content Security Policy only
  allows images from the app itself.

## Decision

### Drink photos are used only when they match the spec

- **Source:** candidates come from Openverse.
- **Licenses:** only CC0, public domain and CC BY. Share-alike and non-commercial licenses are
  excluded.
- **Hand review:** every candidate is checked against its spec, and a photo is accepted only
  with:
  - the spec's glass, or an obvious equivalent (coupe and cocktail glass)
  - a plausible color and a compatible garnish
  - no brand labels and no identifiable faces
  - professional quality
  - no AI-generated images
- **Result:** 33 of 105 drinks have a photo. See `src/content/photos.ts`.

### Every other drink is drawn from its spec

- The illustration is generated from the spec: the glass, the color the ingredients mix to,
  foam and layers, the ice, and the garnish (`features/library/services/drink-art.ts`,
  `DrinkIllustration`).
- Tests require a color for every ingredient and a drawing for every garnish, so an
  illustration can't contradict its recipe.

### Covers use scene photos and family tones

- Scene photos come from the same pipeline and the same rules.
- Each drink family has a deep tone (`--tone-*`) behind covers and illustrations, with white text
  at WCAG AA.

### Everything is bundled

- Photos are processed with `sharp`: cropped, resized to WebP, metadata stripped.
- They're stored in `public/images`; nothing is hotlinked.
- Today's hero is the first screen's largest element. So it doesn't wait for the JavaScript,
  `index.html` contains it: a small inline script marks a start on `/`, and the page shown before
  React loads (`HydrateFallback`) reveals the hero only then. Every other screen still opens on a
  blank page.

### Credits

`/credits` lists the author, source and license of every photo, as CC BY requires. Captions on
spec pages credit the photo they show.

### The owner can replace any photo

```
pnpm images:process <photo> drink <id>
```

Then update the entry in `photos.ts`, using the license "Owner's photo". `photos.test.ts`
checks that every entry has its files and every file has an entry.

## Consequences

- About 2.2 MB of images is added to the app.
- Drinks without a good open photo look consistent instead of unfinished. Their illustrations
  stay correct when a spec changes.
- Adding an ingredient means adding its color, which the test enforces.
