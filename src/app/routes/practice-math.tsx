import { appConfig } from "~/config/app.config";
import { BarMath } from "~/features/practice/components/bar-math";

import type { Route } from "./+types/practice-math";

export const meta: Route.MetaFunction = () => [
  { title: `Bar Math · ${appConfig.academy.name}` },
  {
    name: "description",
    content: "Pour cost, menu pricing, batching, dilution and par levels, with worked solutions.",
  },
];

export default function RouteBarMath() {
  return <BarMath />;
}
