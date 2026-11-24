import { Snowflake, Sparkles } from "lucide-react";

import { getCocktail } from "~/content";
import { glassLabels, iceLabels, methodLabels, techniqueLabels } from "~/content/taxonomy";
import {
  Badge,
  Card,
  Eyebrow,
  GlassIcon,
  Heading,
  ICON_STROKE,
  SpecFact,
  SpecSheet,
  StepList,
} from "~/design-system";
import { specRows } from "~/features/library/services/spec-rows";
import type { UnitSystem } from "~/features/library/services/units";
import type { ReviewFacet } from "~/lib/db/records";

import { facetLabels } from "../services/cards";

/** The answer side of a card: exactly the facet being reviewed, from the Library spec. */
function Answer({
  cocktailId,
  facet,
  units,
}: {
  cocktailId: string;
  facet: ReviewFacet;
  units: UnitSystem;
}) {
  const cocktail = getCocktail(cocktailId);
  if (!cocktail) return null;
  switch (facet) {
    case "spec":
      return <SpecSheet caption={`${cocktail.name} spec`} rows={specRows(cocktail, units)} />;
    case "service":
      return (
        <div className="grid gap-2 py-1 sm:grid-cols-3">
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
            label="Garnish"
            value={cocktail.garnish ?? "None"}
            icon={<Sparkles aria-hidden size={20} strokeWidth={ICON_STROKE} />}
          />
        </div>
      );
    case "method":
      return (
        <div className="flex flex-col gap-1.5 py-1">
          <div className="flex flex-wrap gap-1">
            <Badge tone="accent">{methodLabels[cocktail.method]}</Badge>
            {cocktail.techniques.map((technique) => (
              <Badge key={technique}>{techniqueLabels[technique]}</Badge>
            ))}
          </div>
          <StepList title="Steps" items={cocktail.steps} />
        </div>
      );
  }
}

/** A flashcard: the question, and once revealed, the answer from the Library. */
export function ReviewCard({
  cocktailId,
  facet,
  revealed,
  units,
}: {
  cocktailId: string;
  facet: ReviewFacet;
  revealed: boolean;
  units: UnitSystem;
}) {
  const cocktail = getCocktail(cocktailId);
  if (!cocktail) return null;
  return (
    <Card as="section" aria-labelledby="review-prompt" padding="lg" className="flex flex-col gap-2">
      <Eyebrow tone="accent">{facetLabels[facet].label}</Eyebrow>
      <Heading as="h2" size="lg" id="review-prompt">
        {facetLabels[facet].prompt(cocktail.name)}
      </Heading>
      <div aria-live="polite">
        {revealed ? (
          <div className="border-t border-line pt-1.5">
            <Answer cocktailId={cocktailId} facet={facet} units={units} />
          </div>
        ) : (
          <p className="text-base text-ink-muted">
            Say it, or write it down, before you reveal the answer.
          </p>
        )}
      </div>
    </Card>
  );
}
