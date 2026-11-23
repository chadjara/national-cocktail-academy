/**
 * Runs after `react-router build`: adds a hash-based Content-Security-Policy
 * to every HTML file (ADR 0007). The policy travels into the iOS app with the
 * rest of the build.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { buildClientDir } from "../build.config.mjs";
import { injectContentSecurityPolicy } from "./lib/csp.mjs";

/** @param {string} dir @returns {Promise<string[]>} */
async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => join(entry.parentPath, entry.name));
}

const files = await htmlFiles(buildClientDir);
if (!files.some((file) => file === join(buildClientDir, "index.html"))) {
  throw new Error(`Expected ${join(buildClientDir, "index.html")}; the app has no start page.`);
}
await Promise.all(
  files.map(async (file) => {
    const html = await readFile(file, "utf8");
    await writeFile(file, injectContentSecurityPolicy(html));
  }),
);
console.log(`postbuild: CSP added to ${String(files.length)} page(s)`);
