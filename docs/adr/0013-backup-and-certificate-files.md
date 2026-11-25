# 0013. Backup files and the on-device certificate

**Status:** Accepted · 2026-11-25 · Builds on [0006](0006-unverifiable-certificates.md)

## Context

NCA keeps everything on the phone ([0001](0001-local-first-static-pwa.md)). M6 adds two kinds of
file the student can take off the device:

- a backup, so progress survives a new phone or a reinstall
- the Certificate of Completion as a PDF

Both have to work with no server, and neither may leave the device unless the student chooses.

## Decision

### Backups

- **Format:** a JSON file, `{ format: "nca-backup", version: 1, exportedAt, appVersion, tables }`,
  holding every Dexie table. Theme stays in localStorage and isn't included.
- **Validation:** a restore validates every row with the same Zod record schemas the app writes
  with (`src/lib/db/records.ts`). A file that isn't an NCA backup, comes from a newer app
  version, or fails validation anywhere is rejected whole, with a plain explanation, and nothing
  changes.
- **Restore:** a valid restore replaces everything in a single transaction, after a confirmation
  showing what the backup contains.
- **Erase all progress:** clears every table except device settings (units), after a
  confirmation.

### Certificate

- **Requirements:** every course exam passed, plus the Service Sim. The owner chose this.
- **Record:** one row: `{ displayName, certificateId (NCA-XXXX-XXXX from the secure random
source), issuedAt, appVersion }`. Correcting the name reissues it with the same ID and a new
  date.
- **PDF:** drawn on the device with pdf-lib (MIT) in the PDF standard fonts, so nothing is
  embedded.
  - It is loaded only when a PDF is made, keeping it out of the main bundle.
  - Characters the standard fonts can't draw lose their accents or become "?". The on-screen
    preview always shows the exact name.
- **No QR code and no verify URL.** Per 0006 they would be verification theater. The PDF says
  plainly that it's a certificate of completion: not a license, an accreditation, or a state
  alcohol-server certification.

### Handing files to the student

- **In the app:** the file is written to the app's cache with `@capacitor/filesystem` and opened
  in the share sheet (`@capacitor/share`), so the student can save it to Files, AirDrop it or
  print it.
- **In the browser preview:** it downloads.
- Nothing is uploaded.

## Consequences

- A student can move to a new phone without an account.
- Backups are readable JSON. They hold the same data the phone already holds, and the student
  keeps them wherever they choose.
- Adding a table means adding its schema to the backup map. `backup.test.ts` round-trips every
  table.
