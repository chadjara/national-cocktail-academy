/**
 * Serves the production build the way the iOS app loads it: real files as-is,
 * and index.html (status 200) for any route, so every screen can be opened
 * directly. Used by `pnpm preview`, the end-to-end tests and Lighthouse.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

import { buildClientDir } from "../build.config.mjs";

const root = resolve(buildClientDir);
const port = Number(process.env.PORT ?? 4173);

/** @type {Record<string, string>} */
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

/** @param {string} path @returns {Promise<string | null>} */
async function resolveFile(path) {
  const candidate = normalize(join(root, path));
  if (!candidate.startsWith(root)) return null;
  try {
    return (await stat(candidate)).isFile() ? candidate : null;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const file = (await resolveFile(decodeURIComponent(url.pathname))) ?? join(root, "index.html");
  response.writeHead(200, {
    "content-type": types[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-cache",
  });
  createReadStream(file).pipe(response);
}).listen(port, () => {
  console.log(`Serving ${buildClientDir} at http://localhost:${String(port)}/`);
});
