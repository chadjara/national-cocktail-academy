import { describe, expect, it } from "vitest";

import { certificateRecordSchema } from "~/lib/db/records";

import { issueCertificate, newCertificateId } from "./certificate";
import { certificatePdf } from "./certificate-pdf";

describe("certificate", () => {
  it("makes readable, unambiguous IDs that are unique", () => {
    const ids = new Set(Array.from({ length: 500 }, () => newCertificateId()));
    expect(ids.size).toBe(500);
    for (const id of ids) expect(id).toMatch(/^NCA-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
  });

  it("issues a valid record, and keeps the ID when the name is corrected", () => {
    const first = issueCertificate("  Alex Rivera ", undefined, new Date("2026-11-25T10:00:00Z"));
    expect(certificateRecordSchema.safeParse(first).success).toBe(true);
    expect(first.displayName).toBe("Alex Rivera");
    const corrected = issueCertificate("Alexandra Rivera", first, new Date("2026-11-26T10:00:00Z"));
    expect(corrected.certificateId).toBe(first.certificateId);
    expect(corrected.issuedAt).toBe("2026-11-26T10:00:00.000Z");
  });

  it("renders a one-page PDF with the name and ID", async () => {
    const certificate = issueCertificate(
      "Alex Rivera",
      undefined,
      new Date("2026-11-25T10:00:00Z"),
    );
    const bytes = await certificatePdf(certificate);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    expect(doc.getSubject()).toBe("Alex Rivera");
    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("prints names outside the PDF fonts' character set instead of failing", async () => {
    const certificate = issueCertificate("Zoë Łukasz 王", undefined);
    await expect(certificatePdf(certificate)).resolves.toBeInstanceOf(Uint8Array);
    const { PDFDocument, StandardFonts } = await import("pdf-lib");
    const font = await (await PDFDocument.create()).embedFont(StandardFonts.TimesRoman);
    const { printable } = await import("./certificate-pdf");
    expect(printable("Zoë Łukasz 王", font)).toBe("Zoë ?ukasz ?");
    expect(printable("José Ñúñez", font)).toBe("José Ñúñez");
  });
});
