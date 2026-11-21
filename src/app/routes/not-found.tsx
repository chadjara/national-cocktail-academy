import { Link } from "react-router";

import { appConfig } from "~/config/app.config";
import { Button, Display, Eyebrow, Text } from "~/design-system";

import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => [
  { title: `Not on the menu · ${appConfig.academy.name}` },
];

export default function NotFoundRoute() {
  return (
    <section className="flex max-w-80 flex-col gap-2 py-8">
      <Eyebrow tone="accent">404</Eyebrow>
      <Display size="lg">That's not on the menu.</Display>
      <Text size="lg" tone="muted">
        The page you asked for doesn't exist, or it moved. Head back and pick up where you left off.
      </Text>
      <div className="pt-1">
        <Button asChild>
          <Link to="/">Back to Today</Link>
        </Button>
      </div>
    </section>
  );
}
