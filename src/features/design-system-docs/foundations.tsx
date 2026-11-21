import {
  BookOpen,
  Check,
  ClipboardList,
  Clock,
  FlaskConical,
  GlassWater,
  GraduationCap,
  Home,
  Library,
  Martini,
  Search,
  Timer,
} from "lucide-react";
import type { ReactNode } from "react";

import { Card, Heading, ICON_STROKE, SegmentedControl, Text } from "~/design-system";
import { useTheme } from "~/features/theme/use-theme";
import type { ThemePreference } from "~/features/theme/theme";

import { colorGroups, spacingScale, typeScale } from "./token-catalog";

export function DocSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="flex scroll-mt-10 flex-col gap-3 border-t border-line pt-6"
    >
      <div className="flex max-w-80 flex-col gap-1">
        <Heading as="h2" size="lg" id={id}>
          {title}
        </Heading>
        {intro !== undefined && <Text tone="muted">{intro}</Text>}
      </div>
      {children}
    </section>
  );
}

export function ThemeSection() {
  const { preference, setPreference } = useTheme();
  return (
    <DocSection
      id="theme"
      title="Theme"
      intro="Every token has a light and a dark value. Dark is tuned for dim bars: warm, low-glare, never pure black on pure white."
    >
      <SegmentedControl<ThemePreference>
        label="Theme"
        value={preference}
        onValueChange={setPreference}
        options={[
          { value: "system", label: "System" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />
    </DocSection>
  );
}

export function ColorSection() {
  return (
    <DocSection
      id="color"
      title="Color"
      intro="Deep neutrals, one accent, and state colors. Oxblood marks the action that matters on a screen. Brass appears only when a student earns something."
    >
      <div className="flex flex-col gap-4">
        {colorGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <Heading as="h3" size="sm">
              {group.title}
            </Heading>
            <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
              {group.tokens.map((token) => (
                <li key={token.name} className="flex flex-col gap-1">
                  <span
                    aria-hidden
                    className="h-8 rounded-base border border-line"
                    style={{ background: `var(--${token.name})` }}
                  />
                  <span className="text-sm font-medium text-ink">{token.name}</span>
                  <span className="text-caption text-ink-subtle">{token.usage}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

export function TypographySection() {
  return (
    <DocSection
      id="typography"
      title="Typography"
      intro="Fraunces for display, set with optical sizing so it tightens at large sizes. Inter for everything a student reads or taps. Major-third scale; numbers in specs are tabular."
    >
      <ul className="flex flex-col divide-y divide-line">
        {typeScale.map((entry) => (
          <li
            key={entry.token}
            className="grid gap-1 py-2 sm:grid-cols-[120px_1fr] sm:items-baseline sm:gap-3"
          >
            <code className="text-caption text-ink-subtle">{entry.token}</code>
            <span className={`${entry.className} text-ink`}>{entry.sample}</span>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}

export function SpaceSection() {
  return (
    <DocSection
      id="space"
      title="Space, radius and elevation"
      intro="One spacing unit is 8px. Half steps exist for icon gaps only. One radius, 6px, everywhere; circles are the single exception. Cards are flat with a hairline border; only floating layers cast a shadow."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <ul className="flex flex-col gap-1">
          {spacingScale.map((step) => (
            <li key={step} className="flex items-center gap-2">
              <code className="w-6 text-caption text-ink-subtle">{step}</code>
              <span
                aria-hidden
                className="h-1.5 rounded-base bg-accent"
                style={{ width: `calc(var(--spacing) * ${step})` }}
              />
              <span className="text-sm text-ink-muted tabular">{step * 8}px</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <Card>
            <Text size="sm" tone="muted">
              Card: surface, 1px line, 6px radius, no shadow.
            </Text>
          </Card>
          <div className="rounded-base border border-line bg-raised p-3 shadow-overlay">
            <Text size="sm" tone="muted">
              Overlay: raised, with the single elevation shadow. Menus, dialogs, toasts.
            </Text>
          </div>
        </div>
      </div>
    </DocSection>
  );
}

export function MotionSection() {
  return (
    <DocSection
      id="motion"
      title="Motion"
      intro="150ms for hover and press, 200ms for state changes, 250ms for things entering the screen. Always ease-out. With reduced motion turned on, transitions are effectively instant."
    >
      <ul className="grid gap-1.5 sm:grid-cols-3">
        {[
          ["fast", "150ms", "Hover, press, color"],
          ["base", "200ms", "Toggles, tabs, progress"],
          ["slow", "250ms", "Sheets, toasts, entrances"],
        ].map(([name, value, usage]) => (
          <li key={name}>
            <Card padding="sm" className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">
                {name} · <span className="tabular">{value}</span>
              </span>
              <span className="text-sm text-ink-muted">{usage}</span>
            </Card>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}

const iconSamples = [
  { icon: Home, name: "Today" },
  { icon: BookOpen, name: "Learn" },
  { icon: Library, name: "Library" },
  { icon: Timer, name: "Practice" },
  { icon: Martini, name: "Cocktail" },
  { icon: GlassWater, name: "Glassware" },
  { icon: FlaskConical, name: "Technique" },
  { icon: ClipboardList, name: "Exam" },
  { icon: GraduationCap, name: "Certificate" },
  { icon: Clock, name: "Due" },
  { icon: Search, name: "Search" },
  { icon: Check, name: "Correct" },
];

export function IconSection() {
  return (
    <DocSection
      id="icons"
      title="Icons"
      intro="Lucide only, 1.75 stroke, at 16, 20 or 24px. Icons support a label; they never replace one, except in icon buttons, which always carry an accessible name."
    >
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {iconSamples.map(({ icon: Icon, name }) => (
          <li
            key={name}
            className="flex flex-col items-center gap-1 rounded-base border border-line py-2 text-ink"
          >
            <Icon aria-hidden size={24} strokeWidth={ICON_STROKE} />
            <span className="text-caption text-ink-muted">{name}</span>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}

export function VoiceSection() {
  const pairs = [
    [
      "Shake hard for 12 seconds, then double strain.",
      "Give it a good shake and strain it into your glass!",
    ],
    [
      "Three specs are due. Five minutes.",
      "You're doing amazing! Ready to crush your daily review?",
    ],
    ["That's a sour, not a highball. Check the citrus.", "Oops! Not quite. Try again!"],
    [
      "Pass mark is 80%. You can retake in 12 hours.",
      "Unlock your potential with our AI-powered exam!",
    ],
  ];
  return (
    <DocSection
      id="voice"
      title="Voice"
      intro="Write like a head bartender running a training shift: direct, specific and calm. Say the number. Name the technique. No exclamation marks, no emoji, no hype."
    >
      <ul className="flex flex-col gap-1.5">
        {pairs.map(([good, bad]) => (
          <li key={good} className="grid gap-1.5 sm:grid-cols-2">
            <Card padding="sm" className="border-l-2 border-l-success">
              <span className="eyebrow text-success">Write</span>
              <Text size="sm">{good}</Text>
            </Card>
            <Card padding="sm" className="border-l-2 border-l-danger">
              <span className="eyebrow text-danger">Not</span>
              <Text size="sm" tone="muted">
                {bad}
              </Text>
            </Card>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}
