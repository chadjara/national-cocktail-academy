# 0007. Strict Content Security Policy from build-time hashes

**Status:** Accepted · 2026-11-21

## Context

GitHub Pages can't set response headers, so the policy must be a `<meta>` tag. React Router inlines
hydration scripts whose contents differ per page, which rules out a single hand-written hash.

## Decision

`scripts/postbuild.mjs` computes a SHA-256 for every inline script in every generated HTML file and
writes a per-page CSP meta tag directly after `<meta charset>`. The policy:

- `default-src 'self'`
- `script-src 'self'` plus the exact hashes
- `connect-src 'self'`, so even an injected script has nowhere to send data
- `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`
- `style-src 'self' 'unsafe-inline'`, because Radix positions popovers with style attributes, which
  can't execute code

Zod runs in `jitless` mode (`src/lib/zod-setup.ts`) because its JIT probe uses `new Function`, which
the policy forbids. The only `dangerouslySetInnerHTML` in the codebase is the static theme boot
script, and it is covered by the hashing.

## Consequences

- E2E tests fail on any console error, including CSP violations.
- `frame-ancestors` can't be set from a meta tag; clickjacking risk is low for an app with no account
  actions.
