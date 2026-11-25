import { Link } from "react-router";

import { drinkPhotoSrc, getDrinkPhoto } from "~/content/photos";
import { familyTones, glassLabels } from "~/content/taxonomy";
import type { Cocktail } from "~/content";
import { CoverImage, DrinkIllustration, cn, toneVar } from "~/design-system";

import { drinkArt } from "../services/drink-art";

/** Alt text written from the spec, so it describes what the guest would see. */
export function drinkAlt(cocktail: Cocktail): string {
  const garnish = cocktail.garnish
    ? ` with ${cocktail.garnish.charAt(0).toLowerCase()}${cocktail.garnish.slice(1)}`
    : "";
  return `${cocktail.name} in a ${glassLabels[cocktail.glass].toLowerCase()}${garnish}`;
}

/** A small square picture of a drink for lists: its photo, or its illustration on the family tone. */
export function DrinkThumb({ cocktail, className }: { cocktail: Cocktail; className?: string }) {
  const photo = getDrinkPhoto(cocktail.id);
  const tone = familyTones[cocktail.family];
  return (
    <span
      aria-hidden
      className={cn("relative inline-flex shrink-0 overflow-hidden rounded-base", className)}
      style={{ backgroundColor: toneVar(tone) }}
    >
      {photo ? (
        <img
          src={drinkPhotoSrc(cocktail.id, "thumb")}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <DrinkIllustration art={drinkArt(cocktail)} className="size-full p-0.5 text-on-image" />
      )}
    </span>
  );
}

/**
 * The large picture at the top of a spec: the photo with its credit, or the
 * illustration drawn from the spec on the family tone.
 */
export function DrinkHero({
  cocktail,
  layout = "framed",
  className,
}: {
  cocktail: Cocktail;
  /**
   * "framed": rounded, on its own. "bleed": edge to edge on phones, framed on
   * wider screens. "card": the top of a card, square-cornered.
   */
  layout?: "framed" | "bleed" | "card";
  className?: string;
}) {
  const bleed = layout === "bleed";
  const inset = layout !== "framed";
  const photo = getDrinkPhoto(cocktail.id);
  const tone = familyTones[cocktail.family];
  return (
    <figure className={cn("flex flex-col gap-0.5", bleed && "-mx-2 sm:mx-0", className)}>
      <CoverImage
        rounded={layout === "framed"}
        {...(bleed ? { className: "sm:rounded-base" } : {})}
        src={photo ? drinkPhotoSrc(cocktail.id) : undefined}
        alt={drinkAlt(cocktail)}
        tone={tone}
        aspect="4/3"
        priority
        fallback={
          <DrinkIllustration
            art={drinkArt(cocktail)}
            label={drinkAlt(cocktail)}
            className="h-[86%] text-on-image"
          />
        }
      />
      {photo ? (
        <figcaption
          className={cn(
            "text-caption text-ink-subtle",
            inset && "px-2",
            bleed && "sm:px-0",
            layout === "card" && "pb-1",
          )}
        >
          Photo: {photo.author} · {photo.license} ·{" "}
          <Link to="/credits" className="underline decoration-1 underline-offset-2 hover:text-ink">
            Credits
          </Link>
        </figcaption>
      ) : (
        <figcaption
          className={cn(
            "text-caption text-ink-subtle",
            inset && "px-2",
            bleed && "sm:px-0",
            layout === "card" && "pb-1",
          )}
        >
          Illustration drawn from the spec.
        </figcaption>
      )}
    </figure>
  );
}
