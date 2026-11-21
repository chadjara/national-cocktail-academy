import { createHash } from "node:crypto";

const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;

/**
 * @param {string} html
 * @returns {string[]} sha256 source expressions for every inline script
 */
export function inlineScriptHashes(html) {
  const hashes = new Set();
  for (const match of html.matchAll(INLINE_SCRIPT)) {
    const body = match[1] ?? "";
    if (body.trim() === "") continue;
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  return [...hashes];
}

/**
 * A strict policy for a static, offline app: everything is first-party, and
 * the only inline scripts allowed are the exact ones we shipped. Even if a
 * script were injected, `connect-src 'self'` leaves it nowhere to send data.
 *
 * Inline style *attributes* are allowed because Radix positions popovers with
 * them; style attributes cannot execute code.
 *
 * @param {string[]} scriptHashes
 * @returns {string}
 */
export function buildContentSecurityPolicy(scriptHashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * Inserts the CSP meta tag directly after <meta charset>, ahead of any script.
 *
 * @param {string} html
 * @returns {string}
 */
export function injectContentSecurityPolicy(html) {
  if (html.includes('http-equiv="Content-Security-Policy"')) {
    throw new Error("HTML already contains a Content-Security-Policy meta tag.");
  }
  const policy = buildContentSecurityPolicy(inlineScriptHashes(html));
  const tag = `<meta http-equiv="Content-Security-Policy" content="${policy}"/>`;
  const charset = /<meta charSet="utf-8"\s*\/?>|<meta charset="utf-8"\s*\/?>/i;
  if (!charset.test(html)) throw new Error("Expected a <meta charset> tag to anchor the CSP.");
  return html.replace(charset, (found) => `${found}${tag}`);
}
