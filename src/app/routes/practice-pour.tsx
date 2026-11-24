import { appConfig } from "~/config/app.config";
import { PourTrainer } from "~/features/practice/components/pour-trainer";

import type { Route } from "./+types/practice-pour";

export const meta: Route.MetaFunction = () => [
  { title: `Pour Trainer · ${appConfig.academy.name}` },
  {
    name: "description",
    content: "Learn a steady free-pour count and check it with water and a jigger.",
  },
];

export default function RoutePourTrainer() {
  return <PourTrainer />;
}
