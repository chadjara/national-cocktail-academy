import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router";

import { appConfig } from "~/config/app.config";
import { getCocktail } from "~/content";
import { Button, EmptyState, ICON_STROKE } from "~/design-system";
import { CocktailDetail } from "~/features/library/components/cocktail-detail";

import type { Route } from "./+types/library-cocktail";

export const meta: Route.MetaFunction = ({ params }) => {
  const cocktail = getCocktail(params.cocktailId);
  if (!cocktail) return [{ title: `Not on the menu · ${appConfig.academy.name}` }];
  return [
    { title: `${cocktail.name} · ${appConfig.academy.name}` },
    {
      name: "description",
      content: `How to make a ${cocktail.name}: spec, method, glass, ice and garnish.`,
    },
  ];
};

export default function LibraryCocktailRoute({ params }: Route.ComponentProps) {
  const cocktail = getCocktail(params.cocktailId);

  return (
    <div className="flex flex-col gap-3">
      <Button variant="ghost" asChild>
        <Link to="/library" className="-ml-1 self-start">
          <ArrowLeft aria-hidden size={18} strokeWidth={ICON_STROKE} />
          All specs
        </Link>
      </Button>
      {cocktail ? (
        <CocktailDetail cocktail={cocktail} />
      ) : (
        <EmptyState
          headingLevel="h1"
          icon={<SearchX aria-hidden size={24} strokeWidth={ICON_STROKE} />}
          title="That spec isn't in the library"
          description="It may have been renamed. Search the library for it by name or ingredient."
          action={
            <Button asChild>
              <Link to="/library">Search the library</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
