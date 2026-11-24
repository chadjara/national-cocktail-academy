import { createPublicKey, generateKeyPairSync, verify } from "node:crypto";

import { describe, expect, it } from "vitest";

import { appStoreConnectToken, explainResponse, formatProblems } from "./asc-credentials.mjs";

const { privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const p8 = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const good = {
  p8,
  keyId: "AB12CD34EF",
  issuerId: "8f74b356-a4dd-4e0a-9a1b-0123456789ab",
  teamId: "QH65B2XYZ1",
};

describe("formatProblems", () => {
  it("accepts well-formed credentials", () => {
    expect(formatProblems(good)).toEqual([]);
  });

  it("flags a truncated issuer ID, a partial key file and a bad key ID", () => {
    const problems = formatProblems({
      ...good,
      issuerId: "8f74b356-a4dd-4e0a",
      p8: p8.split("\n").slice(0, 2).join("\n"),
      keyId: "abc",
    });
    expect(problems).toHaveLength(3);
    expect(problems.join(" ")).toMatch(/ASC_ISSUER_ID/);
    expect(problems.join(" ")).toMatch(/ASC_API_KEY_P8/);
    expect(problems.join(" ")).toMatch(/ASC_KEY_ID/);
  });
});

describe("appStoreConnectToken", () => {
  it("produces an ES256 token Apple can verify with the key", () => {
    const token = appStoreConnectToken({ ...good, now: 1_800_000_000_000 });
    const [header, payload, signature] = token.split(".") as [string, string, string];
    expect(JSON.parse(Buffer.from(header, "base64url").toString())).toEqual({
      alg: "ES256",
      kid: "AB12CD34EF",
      typ: "JWT",
    });
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString()) as Record<
      string,
      unknown
    >;
    expect(claims).toMatchObject({ iss: good.issuerId, aud: "appstoreconnect-v1" });
    expect(Number(claims.exp) - Number(claims.iat)).toBe(600);
    const valid = verify(
      "sha256",
      Buffer.from(`${header}.${payload}`),
      { key: createPublicKey(privateKey), dsaEncoding: "ieee-p1363" },
      Buffer.from(signature, "base64url"),
    );
    expect(valid).toBe(true);
  });
});

describe("explainResponse", () => {
  it("names the likely fix for each outcome", () => {
    expect(explainResponse(200, 1, "x").ok).toBe(true);
    expect(explainResponse(200, 0, "com.example.app").message).toMatch(
      /no app with bundle ID com\.example\.app/,
    );
    expect(explainResponse(401, 0, "x").message).toMatch(/same key/);
    expect(explainResponse(403, 0, "x").message).toMatch(/Admin/);
  });
});
