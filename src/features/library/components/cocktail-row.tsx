import type { Cocktail } from "~/content";
import { baseSpiritLabels, glassLabels, methodLabels } from "~/content/taxonomy";
import { SpecCard } from "~/design-system";

import { DrinkThumb } from "./drink-image";

export function cocktailMeta(cocktail: Cocktail): string {
  return [
    baseSpiritLabels[cocktail.base],
    methodLabels[cocktail.method],
    glassLabels[cocktail.glass],
  ].join(" · ");
}

export function CocktailRow({ cocktail }: { cocktail: Cocktail }) {
  return (
    <SpecCard
      to={`/library/${cocktail.id}`}
      title={cocktail.name}
      meta={cocktailMeta(cocktail)}
      leading={<DrinkThumb cocktail={cocktail} className="size-full" />}
    />
  );
}

export function CocktailList({
  cocktails,
  label,
}: {
  cocktails: readonly Cocktail[];
  label: string;
}) {
  return (
    <ul aria-label={label} className="-mx-1.5 flex flex-col">
      {cocktails.map((cocktail) => (
        <li key={cocktail.id}>
          <CocktailRow cocktail={cocktail} />
        </li>
      ))}
    </ul>
  );
}
