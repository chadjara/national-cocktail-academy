import { appConfig } from "~/config/app.config";
import { PageHeader } from "~/design-system";
import { MyBarView } from "~/features/my-bar/components/my-bar-view";

import type { Route } from "./+types/my-bar";

export const meta: Route.MetaFunction = () => [
  { title: `My Bar · ${appConfig.academy.name}` },
  {
    name: "description",
    content: "Mark the bottles on your back bar to see what you can make and what to buy next.",
  },
];

export default function MyBarRoute() {
  return (
    <>
      <PageHeader
        eyebrow="My Bar"
        title="Your back bar"
        lede="Tick what's on the shelf. You'll see every spec you can make tonight, and the one bottle that opens up the most."
      />
      <MyBarView />
    </>
  );
}
