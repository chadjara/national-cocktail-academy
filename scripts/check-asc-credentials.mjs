/**
 * CI step: verifies the App Store Connect API key before archiving.
 * Reads ASC_KEY_PATH, ASC_KEY_ID, ASC_ISSUER_ID, APPLE_TEAM_ID and BUNDLE_ID.
 */
import { readFile } from "node:fs/promises";

import { appStoreConnectToken, explainResponse, formatProblems } from "./lib/asc-credentials.mjs";

/** @param {string} name */
const env = (name) => process.env[name] ?? "";
const p8 = await readFile(env("ASC_KEY_PATH"), "utf8");
const creds = {
  p8,
  keyId: env("ASC_KEY_ID"),
  issuerId: env("ASC_ISSUER_ID"),
  teamId: env("APPLE_TEAM_ID"),
};
const bundleId = env("BUNDLE_ID");

const problems = formatProblems(creds);
if (problems.length > 0) {
  for (const problem of problems) console.log(`::error::${problem}`);
  process.exit(1);
}

const token = appStoreConnectToken(creds);
const url = `https://api.appstoreconnect.apple.com/v1/apps?filter[bundleId]=${encodeURIComponent(bundleId)}&limit=1`;
const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
const matchingApps =
  response.status === 200
    ? (/** @type {{ data?: unknown[] }} */ (await response.json()).data?.length ?? 0)
    : 0;

const { ok, message } = explainResponse(response.status, matchingApps, bundleId);
console.log(ok ? message : `::error::${message}`);
process.exit(ok ? 0 : 1);
