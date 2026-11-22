import MiniSearch from "minisearch";
import { z } from "zod";

import { getIngredient, type Cocktail } from "~/content";
import {
  baseSpiritSchema,
  familySchema,
  methodSchema,
  type BaseSpirit,
  type Family,
  type Method,
} from "~/content/schema";
import { baseSpiritLabels, familyLabels } from "~/content/taxonomy";

const difficultySchema = z.coerce
  .number()
  .pipe(z.union([z.literal(1), z.literal(2), z.literal(3)]));

export type LibraryFilters = {
  q: string;
  base: BaseSpirit[];
  family: Family[];
  method: Method[];
  difficulty: Array<1 | 2 | 3>;
};

export const emptyFilters: LibraryFilters = {
  q: "",
  base: [],
  family: [],
  method: [],
  difficulty: [],
};

/**
 * Reads filters from the URL. The URL is untrusted input, so every value is
 * validated; anything unrecognised is dropped rather than breaking the page.
 */
export function filtersFromSearchParams(params: URLSearchParams): LibraryFilters {
  const pick = <T>(key: string, schema: z.ZodType<T>): T[] =>
    params.getAll(key).flatMap((value) => {
      const parsed = schema.safeParse(value);
      return parsed.success ? [parsed.data] : [];
    });

  return {
    q: (params.get("q") ?? "").trim().slice(0, 80),
    base: pick("base", baseSpiritSchema),
    family: pick("family", familySchema),
    method: pick("method", methodSchema),
    difficulty: pick("difficulty", difficultySchema),
  };
}

export function filtersToSearchParams(filters: LibraryFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  for (const value of filters.base) params.append("base", value);
  for (const value of filters.family) params.append("family", value);
  for (const value of filters.method) params.append("method", value);
  for (const value of filters.difficulty) params.append("difficulty", String(value));
  return params;
}

export function activeFilterCount(filters: LibraryFilters): number {
  return (
    filters.base.length + filters.family.length + filters.method.length + filters.difficulty.length
  );
}

type SearchDocument = {
  id: string;
  name: string;
  ingredients: string;
  family: string;
  base: string;
  garnish: string;
};

function toDocument(cocktail: Cocktail): SearchDocument {
  return {
    id: cocktail.id,
    name: cocktail.name,
    ingredients: cocktail.spec.map((line) => getIngredient(line.ingredient).name).join(" "),
    family: familyLabels[cocktail.family].label,
    base: baseSpiritLabels[cocktail.base],
    garnish: cocktail.garnish ?? "",
  };
}

export type CocktailSearch = (filters: LibraryFilters) => readonly Cocktail[];

/**
 * Builds a search function over a fixed list of cocktails. Text search is
 * prefix and typo tolerant ("negorni" finds Negroni); filters are AND across
 * groups and OR within a group.
 */
export function createCocktailSearch(cocktails: readonly Cocktail[]): CocktailSearch {
  const index = new MiniSearch<SearchDocument>({
    fields: ["name", "ingredients", "family", "base", "garnish"],
    storeFields: [],
    searchOptions: {
      boost: { name: 4, ingredients: 2 },
      prefix: true,
      // 0.3 allows two edits on a 7-letter word, which covers swapped letters ("negorni").
      fuzzy: 0.3,
      combineWith: "AND",
    },
  });
  index.addAll(cocktails.map(toDocument));
  const byId = new Map(cocktails.map((cocktail) => [cocktail.id, cocktail]));

  return (filters) => {
    const matches = filters.q
      ? index.search(filters.q).flatMap((result) => {
          const cocktail = byId.get(String(result.id));
          return cocktail ? [cocktail] : [];
        })
      : cocktails;

    return matches.filter(
      (cocktail) =>
        (filters.base.length === 0 || filters.base.includes(cocktail.base)) &&
        (filters.family.length === 0 || filters.family.includes(cocktail.family)) &&
        (filters.method.length === 0 || filters.method.includes(cocktail.method)) &&
        (filters.difficulty.length === 0 || filters.difficulty.includes(cocktail.difficulty)),
    );
  };
}
