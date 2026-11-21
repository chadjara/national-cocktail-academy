import { BookOpen } from "lucide-react";
import { Link } from "react-router";

import { appConfig } from "~/config/app.config";
import { Button, EmptyState, ICON_STROKE, PageHeader } from "~/design-system";
import { InstallHintCard } from "~/features/pwa/install-hint-card";

import type { Route } from "./+types/today";

export const meta: Route.MetaFunction = () => [
  { title: appConfig.academy.name },
  { name: "description", content: appConfig.academy.tagline },
];

export default function TodayRoute() {
  return (
    <div className="flex flex-col gap-3">
      <PageHeader eyebrow="Today" title={appConfig.academy.name} lede={appConfig.academy.tagline} />
      <InstallHintCard />
      <EmptyState
        icon={<BookOpen aria-hidden size={24} strokeWidth={ICON_STROKE} />}
        title="The first course opens with the next release"
        description="The spec library comes first, then Foundations and Technique. Everything runs on this phone, offline, with no account."
        action={
          <Button variant="secondary" asChild>
            <Link to="/design-system">See the design system</Link>
          </Button>
        }
      />
    </div>
  );
}
