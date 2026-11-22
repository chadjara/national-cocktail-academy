import { Bookmark } from "lucide-react";
import { Link } from "react-router";

import { getCocktail, type Cocktail } from "~/content";
import { Button, EmptyState, Heading, ICON_STROKE, LoadingRegion, Skeleton } from "~/design-system";

import { useFavorites } from "../hooks/use-favorites";
import { CocktailList } from "./cocktail-row";

/** The specs a student saved, for quick reference mid-shift. */
export function FavoritesSection() {
  const { favorites } = useFavorites();

  return (
    <section aria-labelledby="favorites-heading" className="flex flex-col gap-1.5">
      <Heading as="h2" size="lg" id="favorites-heading">
        Saved specs
      </Heading>
      {favorites.status === "loading" && (
        <LoadingRegion label="Loading saved specs">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
          </div>
        </LoadingRegion>
      )}
      {favorites.status === "error" && (
        <p className="text-sm text-danger">
          Saved specs couldn't be read on this device. Reload to try again.
        </p>
      )}
      {favorites.status === "ready" &&
        (favorites.data.length === 0 ? (
          <EmptyState
            headingLevel="h3"
            icon={<Bookmark aria-hidden size={24} strokeWidth={ICON_STROKE} />}
            title="Nothing saved yet"
            description="Save the specs you're working on. They'll be here, offline, when you need them behind the bar."
            action={
              <Button variant="secondary" asChild>
                <Link to="/library">Browse the library</Link>
              </Button>
            }
          />
        ) : (
          <CocktailList
            label="Saved specs"
            cocktails={favorites.data.flatMap((id): Cocktail[] => {
              const cocktail = getCocktail(id);
              return cocktail ? [cocktail] : [];
            })}
          />
        ))}
    </section>
  );
}
