import { Plus, Wine } from "lucide-react";
import { useMemo, useState } from "react";

import { getIngredient, isBottle, listBottles, listCocktails, type Ingredient } from "~/content";
import { ingredientCategoryLabels } from "~/content/taxonomy";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  EmptyState,
  ICON_STROKE,
  LoadingRegion,
  Skeleton,
  Tabs,
  Text,
} from "~/design-system";
import { CocktailList } from "~/features/library/components/cocktail-row";

import { useBar } from "../hooks/use-bar";
import { analyzeBar, type NextBottle } from "../services/bar-analysis";

const isBottleId = (id: string) => isBottle(getIngredient(id));

function groupByCategory(bottles: readonly Ingredient[]) {
  const groups = new Map<Ingredient["category"], Ingredient[]>();
  for (const bottle of bottles) {
    groups.set(bottle.category, [...(groups.get(bottle.category) ?? []), bottle]);
  }
  return [...groups.entries()];
}

const bottleGroups = groupByCategory(listBottles());

function count(n: number, one: string, many: string): string {
  return `${String(n)} ${n === 1 ? one : many}`;
}

function NextBottles({
  nextBottles,
  onAdd,
}: {
  nextBottles: readonly NextBottle[];
  onAdd: (ingredientId: string) => void;
}) {
  if (nextBottles.length === 0) {
    return (
      <Text tone="muted">
        No single bottle unlocks a new spec right now. Add a base spirit to get started.
      </Text>
    );
  }
  return (
    <ul className="grid gap-1.5 sm:grid-cols-3">
      {nextBottles.map((next) => {
        const bottle = getIngredient(next.ingredientId);
        return (
          <li key={next.ingredientId}>
            <Card padding="sm" className="flex h-full flex-col gap-1">
              <div className="flex items-start justify-between gap-1">
                <span className="font-medium text-ink">{bottle.name}</span>
                <Badge tone="success">+{next.unlocks.length}</Badge>
              </div>
              <Text size="sm" tone="muted" className="flex-1">
                {next.unlocks.map((c) => c.name).join(", ")}
              </Text>
              <Button
                variant="secondary"
                onClick={() => onAdd(next.ingredientId)}
                leadingIcon={<Plus aria-hidden size={18} strokeWidth={ICON_STROKE} />}
              >
                Add <span className="sr-only">{bottle.name}</span>
              </Button>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The student's back bar. Tabs keep results one tap away from the checklist,
 * which matters on a phone where the bottle list is long.
 */
export function MyBarView() {
  const { stocked, setStocked, clear } = useBar();
  const [confirmClear, setConfirmClear] = useState(false);

  const analysis = useMemo(
    () =>
      stocked.status === "ready" ? analyzeBar(listCocktails(), stocked.data, isBottleId) : null,
    [stocked],
  );

  if (stocked.status === "loading") {
    return (
      <LoadingRegion label="Loading your bar">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5.5" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
        </div>
      </LoadingRegion>
    );
  }

  if (stocked.status === "error" || analysis === null) {
    return (
      <p className="text-sm text-danger">
        Your bar couldn't be read on this device. Reload to try again.
      </p>
    );
  }

  const { canMake, nextBottles } = analysis;
  const stockedCount = stocked.data.size;

  return (
    <>
      <Tabs
        label="My Bar"
        defaultValue={stockedCount === 0 ? "bottles" : "make"}
        items={[
          {
            value: "make",
            label: `You can make · ${String(canMake.length)}`,
            content:
              canMake.length === 0 ? (
                <EmptyState
                  headingLevel="h2"
                  icon={<Wine aria-hidden size={24} strokeWidth={ICON_STROKE} />}
                  title="Stock your back bar"
                  description="Tick the bottles you have under Bottles. Citrus, syrups, mixers and garnishes are assumed on hand, as they are on any working bar."
                />
              ) : (
                <CocktailList label="Specs you can make" cocktails={canMake} />
              ),
          },
          {
            value: "next",
            label: "Next bottle",
            content: <NextBottles nextBottles={nextBottles} onAdd={(id) => setStocked(id, true)} />,
          },
          {
            value: "bottles",
            label: `Bottles · ${String(stockedCount)}`,
            content: (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <Text size="sm" tone="subtle" aria-live="polite">
                    {count(stockedCount, "bottle", "bottles")} stocked ·{" "}
                    {count(canMake.length, "spec", "specs")}
                  </Text>
                  {stockedCount > 0 && (
                    <Button variant="ghost" onClick={() => setConfirmClear(true)}>
                      Clear bar
                    </Button>
                  )}
                </div>
                <div className="grid gap-x-4 sm:grid-cols-2">
                  {bottleGroups.map(([category, bottles]) => (
                    <fieldset key={category} className="flex flex-col border-b border-line py-1.5">
                      <legend className="pt-1.5 eyebrow text-ink-subtle">
                        {ingredientCategoryLabels[category]}
                      </legend>
                      {bottles.map((bottle) => (
                        <Checkbox
                          key={bottle.id}
                          label={bottle.name}
                          checked={stocked.data.has(bottle.id)}
                          onCheckedChange={(on) => setStocked(bottle.id, on)}
                        />
                      ))}
                    </fieldset>
                  ))}
                </div>
              </div>
            ),
          },
        ]}
      />

      <Dialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear your bar?"
        description={`This unticks all ${count(stockedCount, "bottle", "bottles")} on this device.`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmClear(false)}>
              Keep them
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clear();
                setConfirmClear(false);
              }}
            >
              Clear bar
            </Button>
          </>
        }
      >
        <Text size="sm" tone="muted">
          Saved specs are not affected.
        </Text>
      </Dialog>
    </>
  );
}
