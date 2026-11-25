import { appConfig } from "~/config/app.config";
import { PageHeader } from "~/design-system";
import { CertificateView } from "~/features/certificate/components/certificate-view";

import type { Route } from "./+types/certificate";

export const meta: Route.MetaFunction = () => [
  { title: `Certificate · ${appConfig.academy.name}` },
  { name: "description", content: "Your Certificate of Completion and what it takes to earn it." },
];

export default function CertificateRoute() {
  return (
    <>
      <PageHeader
        eyebrow="Certificate"
        title="Certificate of Completion"
        lede="Pass every course exam and the Service Sim to earn it. It's made on this device, with your name, the date and a certificate ID."
      />
      <CertificateView />
    </>
  );
}
