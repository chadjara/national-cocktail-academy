import { getDatabase } from "~/lib/db/database";
import { certificateRecordSchema, type CertificateRecord } from "~/lib/db/records";

export const certificateRepository = {
  async get(): Promise<CertificateRecord | undefined> {
    const parsed = certificateRecordSchema.safeParse(
      await getDatabase().certificate.get("current"),
    );
    return parsed.success ? parsed.data : undefined;
  },

  async save(certificate: CertificateRecord): Promise<void> {
    await getDatabase().certificate.put(certificateRecordSchema.parse(certificate));
  },
};
