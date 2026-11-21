import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  buildContentSecurityPolicy,
  injectContentSecurityPolicy,
  inlineScriptHashes,
} from "./csp.mjs";

const sha = (body: string) => `'sha256-${createHash("sha256").update(body).digest("base64")}'`;

describe("inlineScriptHashes", () => {
  it("hashes inline scripts and ignores external ones", () => {
    const html = `<script>a()</script><script src="/x.js"></script><script type="module">import "/y.js";</script>`;
    expect(inlineScriptHashes(html)).toEqual([sha("a()"), sha('import "/y.js";')]);
  });

  it("skips empty scripts and de-duplicates", () => {
    expect(
      inlineScriptHashes("<script> </script><script>b()</script><script>b()</script>"),
    ).toEqual([sha("b()")]);
  });
});

describe("buildContentSecurityPolicy", () => {
  it("locks network access to the app's own origin", () => {
    const policy = buildContentSecurityPolicy([]);
    expect(policy).toContain("connect-src 'self'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).toMatch(/script-src 'self'(;|$)/);
  });
});

describe("injectContentSecurityPolicy", () => {
  it("places the policy right after the charset, before any script", () => {
    const html = `<html><head><meta charSet="utf-8"/><script>boot()</script></head></html>`;
    const result = injectContentSecurityPolicy(html);
    const cspIndex = result.indexOf("Content-Security-Policy");
    expect(cspIndex).toBeGreaterThan(result.indexOf("charSet"));
    expect(cspIndex).toBeLessThan(result.indexOf("<script>"));
    expect(result).toContain(sha("boot()"));
  });

  it("refuses to run twice on the same file", () => {
    const once = injectContentSecurityPolicy(`<meta charset="utf-8">`);
    expect(() => injectContentSecurityPolicy(once)).toThrow();
  });
});
