# 0006. Certificates are completion certificates, not verifiable credentials

**Status:** Accepted · 2026-11-21

## Context

The brief asked for verifiable PDFs with a public verification URL. Verification needs a trusted
party to hold the record. With no server ([0001](0001-local-first-static-pwa.md)), any signing key
would ship inside the app, where anyone can extract it. "Verification" would be theater.

## Decision

Issue a **Certificate of Completion** PDF, generated on the device, with the student's name, program,
date, certificate ID and content version. The wording never implies accreditation, licensure or
third-party verification. Responsible Service content states that it does not replace
state-mandated alcohol-server programs (e.g. TABC in Texas, RBS in California).

## Consequences

- Employers can't verify a certificate. If verification becomes a requirement, the smallest honest
  path is a minimal issuing service, which reverses part of 0001 and needs a new ADR.
- No legal exposure from implied credentials.
