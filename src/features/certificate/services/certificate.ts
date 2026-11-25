import { appConfig } from "~/config/app.config";
import type { CertificateRecord } from "~/lib/db/records";

/** Letters and digits that can't be misread: no 0/O, 1/I/L. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function group(bytes: Uint8Array): string {
  return [...bytes].map((byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

/** A certificate ID like NCA-7K3F-9Q2M, from the device's secure random source. */
export function newCertificateId(
  random: (bytes: Uint8Array) => Uint8Array = (b) => crypto.getRandomValues(b),
): string {
  const bytes = random(new Uint8Array(8));
  return `NCA-${group(bytes.slice(0, 4))}-${group(bytes.slice(4, 8))}`;
}

/** Issues a certificate, or reissues it under a corrected name with the same ID. */
export function issueCertificate(
  displayName: string,
  existing: CertificateRecord | undefined,
  now: Date = new Date(),
): CertificateRecord {
  return {
    key: "current",
    displayName: displayName.trim(),
    certificateId: existing?.certificateId ?? newCertificateId(),
    issuedAt: now.toISOString(),
    appVersion: __APP_VERSION__,
  };
}

export const certificateDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export const CERTIFICATE_STATEMENT =
  "has completed the National Cocktail Academy program: every course, its exam, and the Service Sim capstone.";

export const CERTIFICATE_DISCLAIMER = `${appConfig.academy.disclaimer} This certificate of completion is not a license, an accreditation, or a state alcohol-server certification.`;
