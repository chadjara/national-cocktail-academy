import { useCallback } from "react";

import type { CertificateRecord } from "~/lib/db/records";
import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";

import { certificateRepository } from "../repositories/certificate-repository";

export function useCertificate(): {
  certificate: LiveQueryState<CertificateRecord | undefined>;
  save: (certificate: CertificateRecord) => Promise<void>;
} {
  const certificate = useLiveQuery(() => certificateRepository.get(), []);
  const save = useCallback((record: CertificateRecord) => certificateRepository.save(record), []);
  return { certificate, save };
}
