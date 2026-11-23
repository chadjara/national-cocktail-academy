/**
 * Rasterizes resources/icon.svg into the inputs @capacitor/assets needs for
 * the iOS app icon and launch screens. Run after changing the icon:
 *   node scripts/generate-icons.mjs && npx capacitor-assets generate --ios
 */
import { mkdir, readFile } from "node:fs/promises";

import { chromium } from "@playwright/test";

const svg = await readFile("resources/icon.svg", "utf8");
const glass = svg.replace(/<rect[^>]*\/>/, "");

/** @type {Array<{ path: string; size: number; background: string; art: string; scale: number }>} */
const targets = [
  // App icon. App Store icons must be opaque.
  { path: "resources/icon-only.png", size: 1024, background: "#74202e", art: svg, scale: 1 },
  // Launch screens: the coupe, small and centered, on the brand color.
  { path: "resources/splash.png", size: 2732, background: "#74202e", art: glass, scale: 0.18 },
  { path: "resources/splash-dark.png", size: 2732, background: "#12110f", art: glass, scale: 0.18 },
];

await mkdir("resources", { recursive: true });
const browser = await chromium.launch();
try {
  for (const { path, size, background, art, scale } of targets) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    const artSize = Math.round(size * scale);
    await page.setContent(
      `<style>html,body{margin:0;height:100%;background:${background};display:grid;place-items:center}svg{display:block;width:${String(artSize)}px;height:${String(artSize)}px}</style>${art}`,
    );
    await page.screenshot({ path, omitBackground: false });
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`Generated ${String(targets.length)} images.`);
