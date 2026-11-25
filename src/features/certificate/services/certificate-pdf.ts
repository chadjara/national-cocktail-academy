import { PDFDocument, rgb, StandardFonts, type PDFFont } from "pdf-lib";

import { appConfig } from "~/config/app.config";
import type { CertificateRecord } from "~/lib/db/records";

import {
  CERTIFICATE_DISCLAIMER,
  CERTIFICATE_STATEMENT,
  certificateDateFormat,
} from "./certificate";

/** The palette from the design tokens, as PDF colors. */
const INK = rgb(0.13, 0.12, 0.11);
const MUTED = rgb(0.38, 0.35, 0.32);
const ACCENT = rgb(0.47, 0.11, 0.15);
const BRASS = rgb(0.6, 0.47, 0.22);

/**
 * The standard PDF fonts cover Western European letters (é, ñ, ü…) but not
 * every script. Characters a font can't draw lose their accents if that helps,
 * or become "?", so an unusual name never stops the certificate from printing.
 */
export function printable(text: string, font: PDFFont): string {
  // Segment by grapheme so a letter with combining accents is handled as one character.
  return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)]
    .map(({ segment }) => segment)
    .map((char) => {
      for (const candidate of [
        char.normalize("NFC"),
        char.normalize("NFD").replace(/\p{M}/gu, ""),
      ]) {
        try {
          if (candidate !== "") {
            font.encodeText(candidate);
            return candidate;
          }
        } catch {
          // Not in this font's character set; try the next form.
        }
      }
      return "?";
    })
    .join("");
}

/**
 * Draws the Certificate of Completion as a one-page landscape Letter PDF, using
 * the PDF standard fonts so nothing needs embedding. Generated on the device.
 */
export async function certificatePdf(certificate: CertificateRecord): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${appConfig.academy.name} Certificate of Completion`);
  pdf.setAuthor(appConfig.academy.name);
  pdf.setSubject(certificate.displayName);
  pdf.setCreator(appConfig.academy.name);

  const page = pdf.addPage([792, 612]);
  const { width, height } = page.getSize();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // A double rule frames the page.
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: ACCENT,
    borderWidth: 1.5,
  });
  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderColor: BRASS,
    borderWidth: 0.5,
  });

  const centered = (text: string, y: number, size: number, font = sans, color = INK) => {
    page.drawText(text, {
      x: (width - font.widthOfTextAtSize(text, size)) / 2,
      y,
      size,
      font,
      color,
    });
  };

  /** Wraps text into centered lines no wider than maxWidth. */
  const paragraph = (
    text: string,
    top: number,
    size: number,
    maxWidth: number,
    font = sans,
    color = MUTED,
  ) => {
    const lines: string[] = [];
    let line = "";
    for (const word of text.split(" ")) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    if (line) lines.push(line);
    lines.forEach((l, i) => centered(l, top - i * size * 1.35, size, font, color));
  };

  centered(appConfig.academy.name.toUpperCase(), height - 110, 13, sansBold, ACCENT);
  centered("Certificate of Completion", height - 168, 40, serif);
  centered("This certifies that", height - 222, 14, serifItalic, MUTED);

  // The name, shrunk to fit if it's long.
  const name = printable(certificate.displayName, serif);
  let nameSize = 34;
  while (serif.widthOfTextAtSize(name, nameSize) > width - 180 && nameSize > 16) nameSize -= 1;
  centered(name, height - 272, nameSize, serif);
  page.drawLine({
    start: { x: width / 2 - 200, y: height - 286 },
    end: { x: width / 2 + 200, y: height - 286 },
    thickness: 0.75,
    color: BRASS,
  });

  paragraph(CERTIFICATE_STATEMENT, height - 322, 14, 520, serif, INK);

  const date = certificateDateFormat.format(new Date(certificate.issuedAt));
  centered(`Issued ${date}`, 150, 12, sans, INK);
  centered(
    `Certificate ID ${certificate.certificateId}  ·  App version ${certificate.appVersion}`,
    132,
    10,
    sans,
    MUTED,
  );
  paragraph(CERTIFICATE_DISCLAIMER, 92, 8.5, 600, sans, MUTED);

  return pdf.save();
}
