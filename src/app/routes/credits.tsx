import { appConfig } from "~/config/app.config";
import { PageHeader } from "~/design-system";
import { CreditsList } from "~/features/credits/credits-list";

import type { Route } from "./+types/credits";

export const meta: Route.MetaFunction = () => [
  { title: `Photo credits · ${appConfig.academy.name}` },
  { name: "description", content: "The photographers and licenses behind the photos in the app." },
];

export default function CreditsRoute() {
  return (
    <>
      <PageHeader eyebrow="Credits" title="Photo credits" />
      <CreditsList />
    </>
  );
}
