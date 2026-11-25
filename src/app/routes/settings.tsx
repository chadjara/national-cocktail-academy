import { appConfig } from "~/config/app.config";
import { PageHeader } from "~/design-system";
import { YourData } from "~/features/settings/components/your-data";

import type { Route } from "./+types/settings";

export const meta: Route.MetaFunction = () => [
  { title: `Your data · ${appConfig.academy.name}` },
  { name: "description", content: "Units, backups and resetting your progress." },
];

export default function SettingsRoute() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Your data"
        lede="Everything you do in NCA stays on this phone."
      />
      <YourData />
    </>
  );
}
