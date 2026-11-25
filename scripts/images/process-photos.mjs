#!/usr/bin/env node
/**
 * Turns a photo into the app's image files. Use it to replace any drink photo
 * with your own, or to add a scene photo:
 *
 *   pnpm images:process <photo> drink <cocktail-id> [--focus=left|right|top|bottom|center]
 *   pnpm images:process <photo> scene <scene-id>   [--focus=…]
 *
 * Drinks become a 4:3, 800px WebP plus a 240px thumbnail in public/images/drinks/.
 * Scenes become a 3:2, 1200px WebP plus a 600px version in public/images/scenes/.
 * Metadata (camera, GPS) is stripped. Then add or update the entry in
 * src/content/photos.ts with the credit and license; a test checks they match.
 */
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const sizes = {
  drink: { ratio: 4 / 3, full: 800, small: 240, dir: "drinks", smallSuffix: "-thumb" },
  scene: { ratio: 3 / 2, full: 1200, small: 600, dir: "scenes", smallSuffix: "-small" },
};

const [input, kind, id, ...flags] = process.argv.slice(2);
const spec = kind === "drink" || kind === "scene" ? sizes[kind] : undefined;
if (!input || !spec || !id || !/^[a-z0-9-]+$/.test(id)) {
  console.error(
    "Usage: pnpm images:process <photo> <drink|scene> <id> [--focus=left|right|top|bottom|center]",
  );
  process.exit(1);
}
const focus = (flags.find((f) => f.startsWith("--focus="))?.split("=")[1] ?? "center").replace(
  "center",
  "centre",
);
const position = { left: "left", right: "right", top: "top", bottom: "bottom", centre: "centre" }[
  focus
];
if (!position) {
  console.error(`Unknown focus: ${focus}`);
  process.exit(1);
}

const outDir = fileURLToPath(new URL(`../../public/images/${spec.dir}/`, import.meta.url));
await mkdir(outDir, { recursive: true });

/** @type {Array<{ width: number; suffix: string }>} */
const outputs = [
  { width: spec.full, suffix: "" },
  { width: spec.small, suffix: spec.smallSuffix },
];
for (const { width, suffix } of outputs) {
  const height = Math.round(width / spec.ratio);
  const file = `${outDir}${id}${suffix}.webp`;
  await sharp(input)
    .rotate() // honor EXIF orientation before metadata is dropped
    .resize(width, height, { fit: "cover", position })
    .webp({ quality: suffix ? 72 : 78, effort: 6 })
    .toFile(file);
  console.log(`wrote public/images/${spec.dir}/${id}${suffix}.webp`);
}
