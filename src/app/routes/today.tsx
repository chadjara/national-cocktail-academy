import { ArrowRight, GraduationCap, Martini, Target, Wine } from "lucide-react";
import { Link } from "react-router";

import { appConfig } from "~/config/app.config";
import { listCocktails } from "~/content";
import { Card, Heading, ICON_STROKE, PageHeader, Text } from "~/design-system";
import { TodayLearning, courseCount } from "~/features/learn/components/today-learning";
import { FavoritesSection } from "~/features/library/components/favorites-section";
import { TodayReview } from "~/features/practice/components/today-review";

import type { Route } from "./+types/today";

export const meta: Route.MetaFunction = () => [
  { title: appConfig.academy.name },
  { name: "description", content: appConfig.academy.tagline },
];

const entryPoints = [
  {
    to: "/learn",
    icon: GraduationCap,
    title: "The program",
    body: `${String(courseCount)} courses: tools, glassware, technique, garnishes, service, and every family of classic drinks.`,
  },
  {
    to: "/practice",
    icon: Target,
    title: "Practice",
    body: "Daily spec review, Speed Round tickets, a free-pour trainer and bar math.",
  },
  {
    to: "/library",
    icon: Martini,
    title: "Spec library",
    body: `${String(listCocktails().length)} specs from the IBA official list and the modern classics. Search by name or ingredient, in oz or ml.`,
  },
  {
    to: "/my-bar",
    icon: Wine,
    title: "My Bar",
    body: "Tick the bottles on your shelf. See what you can make tonight and which bottle to buy next.",
  },
] as const;

export default function TodayRoute() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="Today" title={appConfig.academy.name} lede={appConfig.academy.tagline} />
      <TodayLearning />
      <TodayReview />
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {entryPoints.map((entry) => (
          <li key={entry.to}>
            <Card interactive className="flex h-full flex-col gap-1.5">
              <entry.icon
                aria-hidden
                size={24}
                strokeWidth={ICON_STROKE}
                className="text-accent-text"
              />
              <Heading as="h2" size="md">
                <Link to={entry.to} className="after:absolute after:inset-0">
                  {entry.title}
                </Link>
              </Heading>
              <Text size="sm" tone="muted" className="flex-1">
                {entry.body}
              </Text>
              <ArrowRight
                aria-hidden
                size={20}
                strokeWidth={ICON_STROKE}
                className="text-ink-subtle"
              />
            </Card>
          </li>
        ))}
      </ul>
      <FavoritesSection />
      <p className="border-t border-line pt-2 text-sm text-ink-subtle">
        {appConfig.academy.disclaimer} No accounts, no tracking. Everything stays on this device.{" "}
        <Link
          to="/settings"
          className="font-medium text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2"
        >
          Your data
        </Link>
        {" · "}
        <Link
          to="/privacy"
          className="font-medium text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2"
        >
          Privacy
        </Link>
      </p>
    </div>
  );
}
