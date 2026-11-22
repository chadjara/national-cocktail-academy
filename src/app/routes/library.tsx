import { appConfig } from "~/config/app.config";
import { listCocktails } from "~/content";
import { PageHeader } from "~/design-system";
import { LibraryBrowser } from "~/features/library/components/library-browser";

import type { Route } from "./+types/library";

export const meta: Route.MetaFunction = () => [
  { title: `Spec library · ${appConfig.academy.name}` },
  {
    name: "description",
    content: `${String(listCocktails().length)} professional cocktail specs: the IBA official list and modern classics, in oz and ml.`,
  },
];

export default function LibraryRoute() {
  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Specs"
        lede="The IBA official list plus the modern classics a working bar is expected to know. Every spec cites its source."
      />
      <LibraryBrowser />
    </>
  );
}
