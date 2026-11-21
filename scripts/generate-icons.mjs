/**
 * Rasterizes public/icons/favicon.svg into the PNG sizes the web app
 * manifest and iOS need. Run after changing the icon: `node scripts/generate-icons.mjs`.
 */
import { readFile } from "node:fs/promises";

import { chromium } from "@playwright/test";

const svg = await readFile("public/icons/favicon.svg", "utf8");
/** @type {Array<{ path: string; size: number }>} */
const targets = [
  { path: "public/icons/icon-192.png", size: 192 },
  { path: "public/icons/icon-512.png", size: 512 },
  { path: "public/icons/icon-maskable-512.png", size: 512 },
  { path: "public/icons/apple-touch-icon.png", size: 180 },
];

const browser = await chromium.launch();
try {
  for (const { path, size } of targets) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(
      `<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    );
    await page.screenshot({ path, omitBackground: false });
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`Generated ${targets.length} icons.`);
