/**
 * Runs after `react-router build`:
 *   0. moves pages prerendered under a base path to the site root,
 *   1. adds a hash-based Content-Security-Policy to every HTML file,
 *   2. sets up GitHub Pages (404.html SPA fallback, .nojekyll),
 *   3. generates the precaching service worker so the app works offline.
 */
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { generateSW } from "workbox-build";

import { basePath, buildClientDir } from "../build.config.mjs";
import { assertHomePageAtRoot, hoistBasePathOutput } from "./lib/base-path.mjs";
import { injectContentSecurityPolicy } from "./lib/csp.mjs";

const SPA_FALLBACK = "__spa-fallback.html";

/** @param {string} dir @returns {Promise<string[]>} */
async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => join(entry.parentPath, entry.name));
}

async function applyCsp() {
  const files = await htmlFiles(buildClientDir);
  await Promise.all(
    files.map(async (file) => {
      const html = await readFile(file, "utf8");
      await writeFile(file, injectContentSecurityPolicy(html));
    }),
  );
  return files.length;
}

async function prepareGitHubPages() {
  await copyFile(join(buildClientDir, SPA_FALLBACK), join(buildClientDir, "404.html"));
  await writeFile(join(buildClientDir, ".nojekyll"), "");
}

async function buildServiceWorker() {
  const { count, size, warnings } = await generateSW({
    globDirectory: buildClientDir,
    globPatterns: ["**/*.{html,js,css,woff2,svg,png,webmanifest}"],
    // Content is English: Latin and Latin Extended cover it. Other font
    // subsets are fetched on demand online and fall back to system fonts offline.
    //
    // Per-spec pages (library/<id>/index.html) are prerendered for fast first
    // loads and search engines, but not precached: their data is already in
    // the JS bundle, so offline navigations render them from the SPA fallback.
    globIgnores: [
      "404.html",
      "library/*/index.html",
      "**/*-{cyrillic,cyrillic-ext,greek,greek-ext,vietnamese}-*.woff2",
    ],
    swDest: join(buildClientDir, "sw.js"),
    modifyURLPrefix: { "": basePath },
    navigateFallback: `${basePath}${SPA_FALLBACK}`,
    cleanupOutdatedCaches: true,
    clientsClaim: false,
    skipWaiting: false,
    sourcemap: false,
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  });
  for (const warning of warnings) console.warn(`[sw] ${warning}`);
  return { count, size };
}

await hoistBasePathOutput(buildClientDir, basePath);
await assertHomePageAtRoot(buildClientDir);
const pages = await applyCsp();
await prepareGitHubPages();
const sw = await buildServiceWorker();

console.log(
  `postbuild: CSP added to ${pages} pages; precached ${sw.count} files (${(sw.size / 1024).toFixed(0)} KiB) under ${basePath}`,
);
