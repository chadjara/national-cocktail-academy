import { ArrowRight, Snowflake, Sparkles, Waves } from "lucide-react";
import { Link } from "react-router";

import { getCocktail } from "~/content";
import { getTool, type Block } from "~/content/curriculum";
import { glassLabels, iceLabels, methodLabels } from "~/content/taxonomy";
import {
  Callout,
  Card,
  GlassIcon,
  Heading,
  ICON_STROKE,
  KeyPoints,
  SegmentedControl,
  SpecFact,
  SpecSheet,
  StepList,
  Text,
  ToolIcon,
} from "~/design-system";
import { useUnits } from "~/features/library/hooks/use-units";
import { specRows } from "~/features/library/services/spec-rows";
import type { UnitSystem } from "~/features/library/services/units";

type ContentBlock = Exclude<Block, { kind: "question" } | { kind: "drill" } | { kind: "scenario" }>;

function ToolList({ tools }: { tools: Extract<Block, { kind: "tools" }>["tools"] }) {
  return (
    <ul className="flex flex-col gap-1" aria-label="Tools">
      {tools.map((id) => {
        const tool = getTool(id);
        return (
          <li key={id} className="flex gap-2 rounded-base border border-line bg-surface p-2">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-base bg-raised text-ink">
              <ToolIcon tool={id} size={36} />
            </span>
            <div className="flex flex-col gap-0.5">
              <Heading as="h3" size="sm">
                {tool.name}
              </Heading>
              <Text size="sm" tone="muted">
                {tool.summary}
              </Text>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function GlassList({ items }: { items: Extract<Block, { kind: "glasses" }>["items"] }) {
  return (
    <ul className="flex flex-col gap-1" aria-label="Glassware">
      {items.map(({ glass, use }) => (
        <li key={glass} className="flex gap-2 rounded-base border border-line bg-surface p-2">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-base bg-raised text-ink">
            <GlassIcon glass={glass} size={36} />
          </span>
          <div className="flex flex-col gap-0.5">
            <Heading as="h3" size="sm">
              {glassLabels[glass]}
            </Heading>
            <Text size="sm" tone="muted">
              {use}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The drink being taught: its live spec, service facts and method, from the Library. */
function LessonSpec({ cocktailId }: { cocktailId: string }) {
  const { units, setUnits } = useUnits();
  const cocktail = getCocktail(cocktailId);
  if (!cocktail) return null;
  const headingId = `spec-${cocktail.id}`;

  return (
    <Card as="section" padding="none" className="flex flex-col" aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-2 border-b border-line px-2 py-1.5">
        <Heading as="h2" size="lg" id={headingId}>
          The spec
        </Heading>
        <SegmentedControl<UnitSystem>
          label="Units"
          value={units}
          onValueChange={setUnits}
          options={[
            { value: "oz", label: "oz" },
            { value: "ml", label: "ml" },
          ]}
        />
      </div>
      <div className="px-2">
        <SpecSheet caption={`${cocktail.name} spec`} rows={specRows(cocktail, units)} />
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-line p-2">
        <SpecFact
          label="Glass"
          value={glassLabels[cocktail.glass]}
          icon={<GlassIcon glass={cocktail.glass} size={20} />}
        />
        <SpecFact
          label="Ice"
          value={iceLabels[cocktail.ice]}
          icon={<Snowflake aria-hidden size={20} strokeWidth={ICON_STROKE} />}
        />
        <SpecFact
          label="Method"
          value={methodLabels[cocktail.method]}
          icon={<Waves aria-hidden size={20} strokeWidth={ICON_STROKE} />}
        />
        <SpecFact
          label="Garnish"
          value={cocktail.garnish ?? "None"}
          icon={<Sparkles aria-hidden size={20} strokeWidth={ICON_STROKE} />}
        />
      </div>
      <div className="flex flex-col gap-2 border-t border-line p-2">
        <StepList title="Method" items={cocktail.steps} />
        {cocktail.note !== undefined && (
          <Callout tone="tip" title="Behind the bar">
            {cocktail.note}
          </Callout>
        )}
        <Link
          to={`/library/${cocktail.id}`}
          className="inline-flex items-center gap-0.5 self-start text-sm font-medium text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2"
        >
          History and variations in the Library
          <ArrowRight aria-hidden size={16} strokeWidth={ICON_STROKE} />
        </Link>
      </div>
    </Card>
  );
}

/** Renders one teaching block. Questions and drills are rendered by the lesson player. */
export function LessonBlock({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case "text":
      return (
        <div className="flex flex-col gap-1.5">
          {block.paragraphs.map((paragraph) => (
            <Text key={paragraph} size="lg">
              {paragraph}
            </Text>
          ))}
        </div>
      );
    case "key-points":
      return <KeyPoints title={block.title} items={block.items} />;
    case "callout":
      return (
        <Callout tone={block.tone} title={block.title}>
          {block.text}
        </Callout>
      );
    case "steps":
      return <StepList title={block.title} items={block.items} />;
    case "tools":
      return <ToolList tools={block.tools} />;
    case "glasses":
      return <GlassList items={block.items} />;
    case "cocktail":
      return <LessonSpec cocktailId={block.cocktailId} />;
  }
}
