import { ExternalLink, ShieldCheck } from "lucide-react";

import { appConfig } from "~/config/app.config";
import { Card, Heading, ICON_STROKE, PageHeader, Text, TextLink } from "~/design-system";
import {
  policyLastUpdated,
  policySections,
  policySummary,
  storedOnDevice,
  type PolicyBlock,
} from "~/features/legal/privacy-policy";

import type { Route } from "./+types/privacy";

export const meta: Route.MetaFunction = () => [
  { title: `Privacy Policy · ${appConfig.academy.name}` },
  {
    name: "description",
    content: `Privacy Policy for the ${appConfig.academy.name} iPhone app. No accounts, no in-app analytics, no advertising and no tracking.`,
  },
];

function OutboundLink({ href, label }: { href: string; label: string }) {
  return (
    <TextLink href={href} target="_blank" rel="noopener noreferrer">
      {label}
      <ExternalLink
        aria-hidden
        size={14}
        strokeWidth={ICON_STROKE}
        className="ml-0.5 inline align-[-2px]"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </TextLink>
  );
}

function Block({ block }: { block: PolicyBlock }) {
  switch (block.kind) {
    case "paragraph":
      return <Text tone="muted">{block.text}</Text>;
    case "list":
      return (
        <ul className="flex list-disc flex-col gap-0.5 pl-3 text-ink-muted">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "link":
      return (
        <Text tone="muted">
          {block.before}
          <OutboundLink href={block.link.href} label={block.link.label} />
          {block.after}
        </Text>
      );
  }
}

function StoredOnDeviceTable() {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="sr-only">Information NCA keeps on your device</caption>
      <thead>
        <tr className="border-b border-line-strong">
          <th scope="col" className="py-1 pr-2 font-semibold text-ink">
            What
          </th>
          <th scope="col" className="py-1 font-semibold text-ink">
            Why
          </th>
        </tr>
      </thead>
      <tbody>
        {storedOnDevice.map((entry) => (
          <tr key={entry.item} className="border-b border-line align-top last:border-b-0">
            <td className="py-1 pr-2 text-ink">
              {entry.item}
              {entry.when === "planned" && (
                <span className="block text-caption text-ink-subtle">When this feature ships</span>
              )}
            </td>
            <td className="py-1 text-ink-muted">{entry.why}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PrivacyRoute() {
  const officialCopy = appConfig.academy.privacyPolicyUrl;
  return (
    <article className="flex max-w-80 flex-col gap-4">
      <PageHeader
        eyebrow={appConfig.academy.name}
        title="Privacy Policy"
        lede={
          <>
            <span className="block text-sm text-ink-subtle">Last updated {policyLastUpdated}</span>
            <span className="mt-1 block text-sm text-ink-subtle">
              The official copy of this policy is published at{" "}
              <OutboundLink href={officialCopy} label={officialCopy.replace(/^https:\/\//, "")} />.
            </span>
          </>
        }
      />

      <Card as="section" className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1 text-success">
          <ShieldCheck aria-hidden size={20} strokeWidth={ICON_STROKE} />
          <span className="eyebrow">The short version</span>
        </div>
        <ul className="flex flex-col gap-1">
          {policySummary.map((line) => (
            <li key={line} className="text-base text-ink">
              {line}
            </li>
          ))}
        </ul>
      </Card>

      {policySections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="flex scroll-mt-10 flex-col gap-1.5"
        >
          <Heading as="h2" size="lg" id={`${section.id}-heading`}>
            {section.heading}
          </Heading>
          {section.blocks.map((block, index) => (
            <Block key={`${section.id}-${String(index)}`} block={block} />
          ))}
          {section.id === "your-device" && <StoredOnDeviceTable />}
        </section>
      ))}
    </article>
  );
}
