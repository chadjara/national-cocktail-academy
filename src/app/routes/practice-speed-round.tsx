import { appConfig } from "~/config/app.config";
import { SpeedRound } from "~/features/practice/components/speed-round";

import type { Route } from "./+types/practice-speed-round";

export const meta: Route.MetaFunction = () => [
  { title: `Speed Round · ${appConfig.academy.name}` },
  { name: "description", content: "Build five drink tickets from memory against the clock." },
];

export default function RouteSpeedRound() {
  return <SpeedRound />;
}
