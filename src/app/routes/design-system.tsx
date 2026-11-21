import { PageHeader, TextLink } from "~/design-system";
import { appConfig } from "~/config/app.config";
import { ComponentsSection } from "~/features/design-system-docs/components-gallery";
import {
  ColorSection,
  IconSection,
  MotionSection,
  SpaceSection,
  ThemeSection,
  TypographySection,
  VoiceSection,
} from "~/features/design-system-docs/foundations";

import type { Route } from "./+types/design-system";

export const meta: Route.MetaFunction = () => [
  { title: `Design system · ${appConfig.academy.name}` },
  { name: "description", content: "Tokens, typography, components and voice for the academy." },
];

const contents = [
  ["theme", "Theme"],
  ["color", "Color"],
  ["typography", "Typography"],
  ["space", "Space"],
  ["motion", "Motion"],
  ["icons", "Icons"],
  ["components", "Components"],
  ["voice", "Voice"],
] as const;

export default function DesignSystemRoute() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Design system"
        lede="The tokens, type and components every screen is built from. Restrained and editorial, like a well-run bar's menu."
      />
      <nav aria-label="On this page" className="pb-4">
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {contents.map(([id, label]) => (
            <li key={id}>
              <TextLink href={`#${id}`}>{label}</TextLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-6">
        <ThemeSection />
        <ColorSection />
        <TypographySection />
        <SpaceSection />
        <MotionSection />
        <IconSection />
        <ComponentsSection />
        <VoiceSection />
      </div>
    </>
  );
}
