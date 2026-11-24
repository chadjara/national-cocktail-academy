import { createPrivateKey, sign } from "node:crypto";

/**
 * Checks App Store Connect API credentials before an iOS build, so a bad key
 * fails in seconds with a plain explanation instead of deep inside xcodebuild.
 * Never prints secret values.
 */

/**
 * @param {{ p8: string; keyId: string; issuerId: string; teamId: string }} creds
 * @returns {string[]} human-readable problems; empty when the formats look right
 */
export function formatProblems({ p8, keyId, issuerId, teamId }) {
  const problems = [];
  const body = p8.trim();
  if (
    !body.startsWith("-----BEGIN PRIVATE KEY-----") ||
    !body.endsWith("-----END PRIVATE KEY-----")
  ) {
    problems.push(
      "ASC_API_KEY_P8 must be the whole .p8 file, from -----BEGIN PRIVATE KEY----- to -----END PRIVATE KEY-----.",
    );
  } else {
    try {
      createPrivateKey(body);
    } catch {
      problems.push(
        "ASC_API_KEY_P8 isn't a readable private key. Paste the file's contents again, unchanged.",
      );
    }
  }
  if (!/^[A-Z0-9]{10}$/.test(keyId.trim())) {
    problems.push(
      "ASC_KEY_ID should be 10 capital letters and digits (it's in the .p8 file name: AuthKey_<KEYID>.p8).",
    );
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(issuerId.trim())) {
    problems.push(
      "ASC_ISSUER_ID should be the full Issuer ID (36 characters with dashes) from the API keys page.",
    );
  }
  if (!/^[A-Z0-9]{10}$/.test(teamId.trim())) {
    problems.push(
      "APPLE_TEAM_ID should be your 10-character Team ID (developer.apple.com → Membership details).",
    );
  }
  return problems;
}

/** @param {Buffer | string} input */
function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

/**
 * Builds the short-lived ES256 token App Store Connect expects.
 *
 * @param {{ p8: string; keyId: string; issuerId: string; now?: number }} args
 */
export function appStoreConnectToken({ p8, keyId, issuerId, now = Date.now() }) {
  const iat = Math.floor(now / 1000);
  const header = base64url(JSON.stringify({ alg: "ES256", kid: keyId.trim(), typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({ iss: issuerId.trim(), iat, exp: iat + 600, aud: "appstoreconnect-v1" }),
  );
  const signature = sign("sha256", Buffer.from(`${header}.${payload}`), {
    key: createPrivateKey(p8.trim()),
    dsaEncoding: "ieee-p1363",
  });
  return `${header}.${payload}.${base64url(signature)}`;
}

/**
 * Explains an App Store Connect API response for the person fixing secrets.
 *
 * @param {number} status
 * @param {number} matchingApps apps found with the bundle ID (only meaningful on 200)
 * @param {string} bundleId
 */
export function explainResponse(status, matchingApps, bundleId) {
  if (status === 200 && matchingApps > 0)
    return { ok: true, message: "Apple accepted the key and found the app." };
  if (status === 200) {
    return {
      ok: false,
      message: `Apple accepted the key, but there's no app with bundle ID ${bundleId}. Create it in App Store Connect with exactly that bundle ID.`,
    };
  }
  if (status === 401) {
    return {
      ok: false,
      message:
        "Apple rejected the key (401). ASC_KEY_ID, ASC_ISSUER_ID and ASC_API_KEY_P8 must all come from the same key: the Key ID shown on that key's row, the Issuer ID above the key list, and that key's downloaded .p8 file. A revoked key also gives 401.",
    };
  }
  if (status === 403) {
    return {
      ok: false,
      message:
        "Apple recognised the key but it lacks permission (403). Create a Team key with Access: Admin.",
    };
  }
  return {
    ok: false,
    message: `Unexpected response from App Store Connect (HTTP ${String(status)}). Try again shortly.`,
  };
}
