import { appConfig } from "~/config/app.config";
import { ServiceSim } from "~/features/practice/components/service-sim";

import type { Route } from "./+types/capstone";

export const meta: Route.MetaFunction = () => [
  { title: `Service Sim · ${appConfig.academy.name}` },
  {
    name: "description",
    content: "The capstone: a simulated shift of drink tickets and guest situations.",
  },
];

export default function CapstoneRoute() {
  return <ServiceSim />;
}
