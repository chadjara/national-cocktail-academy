import { appConfig } from "~/config/app.config";
import { Heading, PageHeader, Text } from "~/design-system";

import type { Route } from "./+types/privacy";

export const meta: Route.MetaFunction = () => [
  { title: `Privacy · ${appConfig.academy.name}` },
  {
    name: "description",
    content: `${appConfig.academy.name} collects no personal data. Everything stays on your device.`,
  },
];

const sections = [
  {
    heading: "What we collect",
    body: "Nothing. There are no accounts, no analytics, no advertising and no tracking of any kind. The app never sends your information to us or to anyone else.",
  },
  {
    heading: "What stays on your device",
    body: "Your saved specs, the bottles you mark in My Bar, your unit and theme settings, and (as the academy grows) your lesson progress and exam results. They're stored only on your phone or computer, in the app's own storage. Delete the app, or clear the site's data in your browser, and they're gone.",
  },
  {
    heading: "Network access",
    body: "The website downloads the app once, then works offline. The iPhone app ships with everything inside it and doesn't need the internet at all. Links to recipe sources open in your browser, and those sites have their own privacy policies.",
  },
  {
    heading: "Children",
    body: "This is professional bartending training for adults of legal drinking age. It isn't directed at children.",
  },
  {
    heading: "Changes",
    body: "If this ever changes, this page will say so before the app does anything differently. Last updated 23 November 2026.",
  },
] as const;

export default function PrivacyRoute() {
  return (
    <article className="flex max-w-80 flex-col gap-4">
      <PageHeader
        eyebrow="Privacy"
        title="Your data stays with you"
        lede={`${appConfig.academy.name} collects no personal data. Here is exactly what that means.`}
        className="pb-0"
      />
      {sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-1">
          <Heading as="h2" size="lg">
            {section.heading}
          </Heading>
          <Text tone="muted">{section.body}</Text>
        </section>
      ))}
    </article>
  );
}
