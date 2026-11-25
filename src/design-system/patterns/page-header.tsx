import type { ReactNode } from "react";

import { cn } from "../cn";
import { CoverImage } from "../components/cover";
import type { Tone } from "../components/tone";
import { Display, Eyebrow } from "../components/typography";

export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  image,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  actions?: ReactNode;
  /** A cover photo: the header becomes a hero with the title over the picture. */
  image?: { src: string; alt: string; tone: Tone };
  className?: string;
}) {
  if (image) {
    return (
      <header className={cn("-mx-2 pb-4 sm:mx-0", className)}>
        <CoverImage
          src={image.src}
          alt={image.alt}
          tone={image.tone}
          aspect="auto"
          shade
          priority
          rounded={false}
          className="flex min-h-30 flex-col justify-end sm:rounded-base"
        >
          <div className="flex max-w-80 flex-col gap-1 p-3 sm:p-4">
            {eyebrow !== undefined && (
              <p className="text-caption font-semibold tracking-(--text-caption--letter-spacing) text-on-image/85 uppercase">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display-optical text-display-md font-normal tracking-[-0.02em] text-on-image md:text-display-lg">
              {title}
            </h1>
            {lede !== undefined && <p className="text-base text-on-image/90 sm:text-lg">{lede}</p>}
          </div>
        </CoverImage>
        {actions !== undefined && <div className="flex shrink-0 gap-1 pt-2">{actions}</div>}
      </header>
    );
  }
  return (
    <header
      className={cn(
        "flex flex-col gap-2 pb-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex max-w-80 flex-col gap-1">
        {eyebrow !== undefined && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
        <Display size="lg">{title}</Display>
        {lede !== undefined && <p className="text-lg text-ink-muted">{lede}</p>}
      </div>
      {actions !== undefined && <div className="flex shrink-0 gap-1">{actions}</div>}
    </header>
  );
}
