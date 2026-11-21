/**
 * Serves the production build the way GitHub Pages does: files as-is,
 * directory index.html, and 404.html (the SPA fallback) for anything else.
 * Used by `pnpm preview` and the end-to-end tests.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

import { basePath, buildClientDir } from "../build.config.mjs";

const root = resolve(buildClientDir);
const port = Number(process.env.PORT ?? 4173);

/** @type {Record<string, string>} */
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

/** @param {string} path @returns {Promise<string | null>} */
async function resolveFile(path) {
  const candidate = normalize(join(root, path));
  if (!candidate.startsWith(root)) return null;
  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
    if (info.isDirectory()) {
      const index = join(candidate, "index.html");
      if ((await stat(index)).isFile()) return index;
    }
  } catch {
    return null;
  }
  return null;
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  if (!url.pathname.startsWith(basePath)) {
    response.writeHead(302, { location: basePath }).end();
    return;
  }
  const relative = decodeURIComponent(url.pathname.slice(basePath.length));
  const file = await resolveFile(relative);
  const target = file ?? join(root, "404.html");
  response.writeHead(file ? 200 : 404, {
    "content-type": types[extname(target)] ?? "application/octet-stream",
    "cache-control": "no-cache",
  });
  createReadStream(target).pipe(response);
}).listen(port, () => {
  console.log(`Serving ${buildClientDir} at http://localhost:${port}${basePath}`);
});
