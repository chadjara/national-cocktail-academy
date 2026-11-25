import { ExternalLink } from "lucide-react";

import { getCocktail } from "~/content";
import { drinkPhotos, scenePhotos, type PhotoCredit } from "~/content/photos";
import { Heading, ICON_STROKE, Text, TextLink } from "~/design-system";

function External({ href, children }: { href: string; children: string }) {
  return (
    <TextLink href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalLink
        aria-hidden
        size={13}
        strokeWidth={ICON_STROKE}
        className="ml-0.5 inline align-[-2px]"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </TextLink>
  );
}

function CreditRow({ subject, photo }: { subject: string; photo: PhotoCredit }) {
  return (
    <li className="flex flex-col gap-0.5 py-1.5">
      <span className="text-base font-medium text-ink">{subject}</span>
      <span className="text-sm text-ink-muted">
        “{photo.title}” by {photo.author} ·{" "}
        <External href={photo.sourceUrl}>{photo.source}</External> ·{" "}
        {photo.licenseUrl ? (
          <External href={photo.licenseUrl}>{photo.license}</External>
        ) : (
          photo.license
        )}
      </span>
    </li>
  );
}

/** Every photo in the app with its author, source and license, as the licenses require. */
export function CreditsList() {
  return (
    <div className="flex max-w-80 flex-col gap-4">
      <Text tone="muted">
        Photos are used under the licenses shown, and some are cropped and resized. Drinks without a
        photo are illustrations drawn from their spec. To use your own photos instead, see the
        project README.
      </Text>
      <section aria-labelledby="drink-photos" className="flex flex-col gap-1">
        <Heading as="h2" size="lg" id="drink-photos">
          Drink photos
        </Heading>
        <ul aria-labelledby="drink-photos" className="flex flex-col divide-y divide-line">
          {drinkPhotos.map((photo) => (
            <CreditRow
              key={photo.id}
              subject={getCocktail(photo.id)?.name ?? photo.id}
              photo={photo}
            />
          ))}
        </ul>
      </section>
      <section aria-labelledby="scene-photos" className="flex flex-col gap-1">
        <Heading as="h2" size="lg" id="scene-photos">
          Cover photos
        </Heading>
        <ul aria-labelledby="scene-photos" className="flex flex-col divide-y divide-line">
          {scenePhotos.map((photo) => (
            <CreditRow key={photo.id} subject={photo.alt} photo={photo} />
          ))}
        </ul>
      </section>
    </div>
  );
}
