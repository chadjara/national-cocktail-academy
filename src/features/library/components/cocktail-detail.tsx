import {
  Bookmark,
  BookmarkCheck,
  Layers,
  Clock3,
  ExternalLink,
  Snowflake,
  Sparkles,
  Waves,
  Share as ShareIcon,
} from "lucide-react";

import type { Cocktail } from "~/content";
import {
  difficultyLabels,
  familyLabels,
  glassLabels,
  ibaLabels,
  iceLabels,
  methodLabels,
  techniqueLabels,
} from "~/content/taxonomy";
import {
  Badge,
  Button,
  Card,
  Display,
  Eyebrow,
  GlassIcon,
  Heading,
  ICON_STROKE,
  SegmentedControl,
  SpecFact,
  SpecSheet,
  Text,
  TextLink,
} from "~/design-system";

import { useReviewEnrollment } from "~/features/practice/hooks/use-review";
import { canShare, share } from "~/lib/native";
import { useHydrated } from "~/lib/use-hydrated";

import { useFavorites } from "../hooks/use-favorites";
import { useUnits } from "../hooks/use-units";
import { buildShareText } from "../services/share-text";
import { specRows } from "../services/spec-rows";
import { DrinkHero } from "./drink-image";
import { mlToOz, totalMl, type UnitSystem } from "../services/units";

function ShareButton({ cocktail, units }: { cocktail: Cocktail; units: UnitSystem }) {
  // navigator.share and the native bridge only exist after hydration.
  const hydrated = useHydrated();
  if (!hydrated || !canShare()) return null;
  return (
    <Button
      variant="secondary"
      onClick={() => void share(buildShareText(cocktail, units))}
      leadingIcon={<ShareIcon aria-hidden size={18} strokeWidth={ICON_STROKE} />}
    >
      Share <span className="sr-only">{cocktail.name}</span>
    </Button>
  );
}

function FavoriteButton({ cocktailId, name }: { cocktailId: string; name: string }) {
  const { favorites, toggle } = useFavorites();
  const saved = favorites.status === "ready" && favorites.data.includes(cocktailId);
  return (
    <Button
      variant="secondary"
      aria-pressed={saved}
      disabled={favorites.status === "loading"}
      onClick={() => toggle(cocktailId, saved)}
      leadingIcon={
        saved ? (
          <BookmarkCheck
            aria-hidden
            size={18}
            strokeWidth={ICON_STROKE}
            className="text-accent-text"
          />
        ) : (
          <Bookmark aria-hidden size={18} strokeWidth={ICON_STROKE} />
        )
      }
    >
      <span className="sr-only">{name}: </span>
      {saved ? "Saved" : "Save"}
    </Button>
  );
}

function ReviewButton({ cocktailId, name }: { cocktailId: string; name: string }) {
  const { enrolled, setEnrolled } = useReviewEnrollment(cocktailId);
  const added = enrolled.status === "ready" && enrolled.data;
  return (
    <Button
      variant="secondary"
      aria-pressed={added}
      disabled={enrolled.status === "loading"}
      onClick={() => setEnrolled(!added)}
      leadingIcon={
        <Layers
          aria-hidden
          size={18}
          strokeWidth={ICON_STROKE}
          className={added ? "text-accent-text" : undefined}
        />
      }
    >
      <span className="sr-only">{name}: </span>
      {added ? "In review" : "Review"}
    </Button>
  );
}

export function CocktailDetail({ cocktail }: { cocktail: Cocktail }) {
  const { units, setUnits } = useUnits();
  const volume = totalMl(cocktail.spec.map((line) => line.amount));

  const rows = specRows(cocktail, units);

  return (
    <article className="flex flex-col gap-4">
      <DrinkHero cocktail={cocktail} layout="bleed" />
      <header className="flex flex-col gap-2">
        <Eyebrow tone="accent">{familyLabels[cocktail.family].label}</Eyebrow>
        <Display size="xl">{cocktail.name}</Display>
        <div className="flex flex-wrap gap-1">
          <Badge>{methodLabels[cocktail.method]}</Badge>
          <Badge tone={cocktail.difficulty === 3 ? "warning" : "neutral"}>
            {difficultyLabels[cocktail.difficulty]}
          </Badge>
          {cocktail.iba !== undefined && <Badge tone="accent">{ibaLabels[cocktail.iba]}</Badge>}
        </div>
      </header>

      <section aria-labelledby="spec-heading" className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Heading as="h2" size="lg" id="spec-heading">
            Spec
          </Heading>
          <div className="flex items-center gap-1">
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
        </div>
        <Card padding="sm" className="px-2">
          <SpecSheet caption={`${cocktail.name} spec`} rows={rows} />
        </Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Text size="sm" tone="subtle">
            {volume > 0 &&
              `${units === "oz" ? `${mlToOz(volume)} oz` : `${String(volume)} ml`} measured, before dilution`}
          </Text>
          <div className="flex flex-wrap gap-1">
            <ShareButton cocktail={cocktail} units={units} />
            <ReviewButton cocktailId={cocktail.id} name={cocktail.name} />
            <FavoriteButton cocktailId={cocktail.id} name={cocktail.name} />
          </div>
        </div>
      </section>

      <section
        aria-label="Service"
        className="grid grid-cols-2 gap-3 rounded-base border border-line p-3"
      >
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
      </section>

      <section aria-labelledby="method-heading" className="flex flex-col gap-2">
        <Heading as="h2" size="lg" id="method-heading">
          Method
        </Heading>
        <ol className="flex flex-col gap-1.5">
          {cocktail.steps.map((step, index) => (
            <li key={step} className="flex gap-1.5">
              <span
                aria-hidden
                className="inline-flex size-3 shrink-0 items-center justify-center rounded-full border border-line-strong text-caption font-semibold text-ink-muted tabular"
              >
                {index + 1}
              </span>
              <Text>{step}</Text>
            </li>
          ))}
        </ol>
        {cocktail.techniques.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            <span className="text-sm text-ink-subtle">Techniques:</span>
            {cocktail.techniques.map((technique) => (
              <Badge key={technique}>{techniqueLabels[technique]}</Badge>
            ))}
          </div>
        )}
      </section>

      {cocktail.note !== undefined && (
        <aside className="rounded-base border-l-2 border-accent bg-accent-subtle px-2 py-1.5">
          <p className="eyebrow text-accent-text">Behind the bar</p>
          <Text className="pt-0.5">{cocktail.note}</Text>
        </aside>
      )}

      {cocktail.history !== undefined && (
        <section aria-labelledby="history-heading" className="flex flex-col gap-1">
          <Heading as="h2" size="lg" id="history-heading">
            History
          </Heading>
          <Text tone="muted" className="flex gap-1">
            <Clock3 aria-hidden size={18} strokeWidth={ICON_STROKE} className="mt-0.5 shrink-0" />
            {cocktail.history}
          </Text>
        </section>
      )}

      {cocktail.variations.length > 0 && (
        <section aria-labelledby="variations-heading" className="flex flex-col gap-1">
          <Heading as="h2" size="lg" id="variations-heading">
            Variations
          </Heading>
          <ul className="flex flex-col divide-y divide-line">
            {cocktail.variations.map((variation) => (
              <li key={variation.name} className="py-1">
                <span className="font-medium text-ink">{variation.name}.</span>{" "}
                <span className="text-ink-muted">{variation.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="flex flex-col gap-1 border-t border-line pt-2">
        <p className="eyebrow text-ink-subtle">Sources</p>
        <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-sm">
          {cocktail.sources.map((source) => (
            <li key={source.url}>
              <TextLink href={source.url} target="_blank" rel="noopener noreferrer">
                {source.name}
                <ExternalLink
                  aria-hidden
                  size={14}
                  strokeWidth={ICON_STROKE}
                  className="ml-0.5 inline align-[-2px]"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </TextLink>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
