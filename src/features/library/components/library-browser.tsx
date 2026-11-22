import { SearchX, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { listCocktails } from "~/content";
import type { BaseSpirit, Family, Method } from "~/content/schema";
import { baseSpiritLabels, difficultyLabels, familyLabels, methodLabels } from "~/content/taxonomy";
import {
  Button,
  Checkbox,
  ChipGroup,
  EmptyState,
  ICON_STROKE,
  SearchField,
  Sheet,
} from "~/design-system";

import { useHydrated } from "~/lib/use-hydrated";

import {
  activeFilterCount,
  createCocktailSearch,
  emptyFilters,
  filtersFromSearchParams,
  filtersToSearchParams,
  type LibraryFilters,
} from "../services/search";
import { CocktailList } from "./cocktail-row";

const search = createCocktailSearch(listCocktails());

const baseOptions = (Object.keys(baseSpiritLabels) as BaseSpirit[]).map((value) => ({
  value,
  label: baseSpiritLabels[value],
}));

function toggle<T>(list: readonly T[], value: T, on: boolean): T[] {
  return on ? [...list, value] : list.filter((item) => item !== value);
}

function FilterGroup<V extends string | number>({
  legend,
  options,
  selected,
  onChange,
}: {
  legend: string;
  options: ReadonlyArray<{ value: V; label: string }>;
  selected: readonly V[];
  onChange: (next: V[]) => void;
}) {
  return (
    <fieldset className="flex flex-col border-b border-line pb-2 last:border-b-0">
      <legend className="mb-0.5 pt-2 eyebrow text-ink-subtle">{legend}</legend>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={selected.includes(option.value)}
          onCheckedChange={(on) => onChange(toggle(selected, option.value, on))}
        />
      ))}
    </fieldset>
  );
}

/**
 * Search and filter the spec library. Filters live in the URL, so they
 * survive a reload, work with the back button, and can be shared.
 */
export function LibraryBrowser() {
  const [params, setParams] = useSearchParams();
  // Prerendered HTML has no query string. Match it during hydration, then
  // apply the URL's filters.
  const hydrated = useHydrated();
  const filters = useMemo(
    () => (hydrated ? filtersFromSearchParams(params) : emptyFilters),
    [hydrated, params],
  );
  const results = useMemo(() => search(filters), [filters]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetFilterCount =
    filters.family.length + filters.method.length + filters.difficulty.length;

  const update = (next: Partial<LibraryFilters>) => {
    setParams(filtersToSearchParams({ ...filters, ...next }), {
      replace: true,
      preventScrollReset: true,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        <SearchField
          className="flex-1"
          label="Search specs"
          placeholder="Name or ingredient"
          value={filters.q}
          onValueChange={(q) => update({ q })}
        />
        <Button
          variant="secondary"
          onClick={() => setSheetOpen(true)}
          leadingIcon={<SlidersHorizontal aria-hidden size={18} strokeWidth={ICON_STROKE} />}
        >
          Filters{sheetFilterCount > 0 ? ` · ${String(sheetFilterCount)}` : ""}
        </Button>
      </div>

      <ChipGroup<BaseSpirit>
        label="Base spirit"
        value={filters.base}
        onValueChange={(base) => update({ base })}
        options={baseOptions}
      />

      <div className="flex items-center justify-between pt-1">
        <p className="text-sm text-ink-subtle" aria-live="polite">
          {results.length === 1 ? "1 spec" : `${String(results.length)} specs`}
        </p>
        {activeFilterCount(filters) + (filters.q ? 1 : 0) > 0 && (
          <Button variant="ghost" onClick={() => update(emptyFilters)}>
            Clear all
          </Button>
        )}
      </div>

      {results.length > 0 ? (
        <CocktailList cocktails={results} label="Specs" />
      ) : (
        <EmptyState
          icon={<SearchX aria-hidden size={24} strokeWidth={ICON_STROKE} />}
          title="No specs match"
          description="Check the spelling, or loosen a filter. Search covers names and ingredients."
          action={
            <Button variant="secondary" onClick={() => update(emptyFilters)}>
              Clear search and filters
            </Button>
          }
        />
      )}

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Filter specs"
        actions={
          <Button fullWidth onClick={() => setSheetOpen(false)}>
            Show {results.length === 1 ? "1 spec" : `${String(results.length)} specs`}
          </Button>
        }
      >
        <FilterGroup<Family>
          legend="Family"
          options={(Object.keys(familyLabels) as Family[]).map((value) => ({
            value,
            label: familyLabels[value].label,
          }))}
          selected={filters.family}
          onChange={(family) => update({ family })}
        />
        <FilterGroup<Method>
          legend="Method"
          options={(Object.keys(methodLabels) as Method[]).map((value) => ({
            value,
            label: methodLabels[value],
          }))}
          selected={filters.method}
          onChange={(method) => update({ method })}
        />
        <FilterGroup<1 | 2 | 3>
          legend="Difficulty"
          options={([1, 2, 3] as const).map((value) => ({
            value,
            label: difficultyLabels[value],
          }))}
          selected={filters.difficulty}
          onChange={(difficulty) => update({ difficulty })}
        />
      </Sheet>
    </div>
  );
}
