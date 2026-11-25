/**
 * Serves the production build the way the iOS app loads it: real files as-is,
 * and index.html (status 200) for any route, so every screen can be opened
 * directly. Used by `pnpm preview`, the end-to-end tests and Lighthouse.
 * Text files are compressed the way any real web host would, so Lighthouse
 * measures realistic transfer sizes.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { createBrotliCompress, createGzip } from "node:zlib";

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
  ".webp": "image/webp",
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

const compressible = new Set([".html", ".js", ".css", ".json", ".svg"]);

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const file = (await resolveFile(decodeURIComponent(url.pathname))) ?? join(root, "index.html");
  const accepts = String(request.headers["accept-encoding"] ?? "");
  const encoding = !compressible.has(extname(file))
    ? undefined
    : /\bbr\b/.test(accepts)
      ? "br"
      : /\bgzip\b/.test(accepts)
        ? "gzip"
        : undefined;
  response.writeHead(200, {
    "content-type": types[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-cache",
    vary: "accept-encoding",
    ...(encoding ? { "content-encoding": encoding } : {}),
  });
  const stream = createReadStream(file);
  if (encoding === "br") stream.pipe(createBrotliCompress()).pipe(response);
  else if (encoding === "gzip") stream.pipe(createGzip()).pipe(response);
  else stream.pipe(response);
}).listen(port, () => {
  console.log(`Serving ${buildClientDir} at http://localhost:${String(port)}/`);
});
